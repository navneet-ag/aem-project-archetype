import os
import sys
import requests
import json
from bs4 import BeautifulSoup
from urllib.parse import urlparse

instance_url = "http://localhost:4503"
auth = ('admin', 'admin')
service_url = "http://localhost:8080"

def fetch_html_content(base_url):
    url = f"{instance_url}/content/dam/formsanddocuments/{base_url}/jcr:content?wcmmode=disabled"
    try:
        response = requests.get(url, auth=auth)
        response.raise_for_status()
        return response.text
    except requests.exceptions.RequestException as e:
        print(f"Error fetching HTML content: {e}")
        sys.exit(1)

def extract_divs_to_file(html_content, output_file):
    # Parse the HTML content using BeautifulSoup
    soup = BeautifulSoup(html_content, 'html.parser')

    # Find all div elements with class "cmp-adaptiveform-container"
    adaptiveform_divs = soup.find_all('div', class_='cmp-adaptiveform-container')

    # Prepare the output as a string
    output_str = ""
    for div in adaptiveform_divs:
        output_str += str(div) + "\n"

    # Escape the output for cURL usage
    escaped_output = json.dumps(output_str)

    # Write the escaped output to a text file
    # with open(output_file, 'w', encoding='utf-8') as outfile:
    #     outfile.write(escaped_output)

    print(f"Escaped output has been saved to {output_file}")
    return escaped_output

def fetch_and_store_model_json(form_path, output_file):
    # Append the remaining part to the form path
    url = f"{instance_url}/content/forms/af/{form_path}/jcr:content/guideContainer.model.en.json"

    try:
        # Send GET request to fetch the model JSON
        response = requests.get(url, auth=auth)
        response.raise_for_status()  # Raise an exception for HTTP errors

        # Get the JSON content
        model_json = response.json()

        # Escape the JSON for sending in the body of a request
        escaped_json = json.dumps(model_json).replace('"', '\\"')

        # Write the escaped JSON string to the output file
        # with open(output_file, 'w') as file:
        #     file.write(escaped_json)

        print(f"Model JSON successfully fetched and stored in {output_file}")
        return escaped_json
    except requests.exceptions.RequestException as e:
        print(f"Error fetching model JSON: {e}")

def send_request_and_save_response(url, data, output_file='response.cy.js'):
    """
    Sends a POST request to the specified URL with JSON data and saves the response to a file.

    Args:
    - url (str): The URL to send the request to.
    - data (dict): The JSON data to send in the request body.
    - output_file (str, optional): The file path to save the response. Defaults to 'response.json'.
    """
    headers = {
        'Content-Type': 'application/json'
    }

    # Send the POST request
    response = requests.post(url, headers=headers, json=data)

    # Check if the request was successful
    if response.status_code == 200:
        try:
            # Parse the JSON response
            response_json = response.json()
            print(response_json['tests'][0])
            with open(output_file, 'w') as file:
                file.write(response_json['tests'][0])
        except json.JSONDecodeError as e:
            print(f"Failed to decode JSON: {str(e)}")
    else:
        print(f"Failed to get a response. Status code: {response.status_code}")


if __name__ == "__main__":
    if len(sys.argv) != 3:
        print("Usage: python script.py form_path user_instructions")
        sys.exit(1)

    url = sys.argv[1]
    user_instructions = sys.argv[2]
    parsed_url = urlparse(url)
    output_file_name = os.path.basename(parsed_url.path.rstrip('/'))

    html_content = fetch_html_content(url)
    html = extract_divs_to_file(html_content, f"{output_file_name}_html.txt")
    json_ = fetch_and_store_model_json(url, f"{output_file_name}_model.txt")
    requestBody = {
        "userInstructions": user_instructions,
        "referenceHTML": html,
        "referenceJson": json_
    }
    # with open(f"{output_file_name}_request.txt", 'w') as file:
    #     file.write(json.dumps(requestBody))

    send_request_and_save_response(f'{service_url}/adobe/formsgenai/cypress-test', requestBody,f'cypress/e2e/{output_file_name}.cy.js' )
    os.system(f'npx cypress run --spec "cypress/e2e/{output_file_name}.cy.js"')
