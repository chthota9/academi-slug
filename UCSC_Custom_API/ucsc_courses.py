from flask import Flask, request, jsonify, make_response
import json
import requests
import os
from os import listdir
from logger_helper import LoggerHelpers


# references:
# - restful api - https://blog.miguelgrinberg.com/post/designing-a-restful-api-with-python-and-flask
# - auth - http://flask-httpauth.readthedocs.io/en/latest/

class Helpers():
    # Function that finds the substring between two strings
    def find_between(self, s, first, last):
        try:
            start = s.index(first) + len(first)
            end = s.index(last, start)
            return s[start:end]
        except ValueError:
            return ""

    # Helper function that loads json files for me.
    def load_json_file(self, filepath):
        with open(filepath, 'rb') as f:
            json_data = json.loads(f.read())
        return json_data

class ConfigObject():
    # Specifies API Endpoint for class search data
    api_endpoint = "https://pisa.ucsc.edu/class_search/index.php"

    # Loads default payload needed to send POST parameters to class search endpoint
    default_payload = Helpers.load_json_file(Helpers, '{}/payload.json'.format(os.getcwd()))

    # Initializes custom logging solution.. really helpful
    logger = LoggerHelpers()

class CourseParser():


    # Parses the latest term info from the front page
    @staticmethod
    def get_term_info():
        #Gets the raw HTML results
        raw_html_results = requests.get(ConfigObject.api_endpoint).text

        # Replacement 1: Get rid of all new lines
        # Replacement 2: Every HTML comment will have a newline before it to make parsing easier
        parsed_results = str(raw_html_results.replace('\n','').replace('<!--','\n<!-- ')).split('\n')[4:]

        # Grab the string containing all the terms
        term_string = ""
        for entries in parsed_results:
            if 'term_dropdown' in entries:
                term_string = entries

        # Yes I realize that I could do this within the for loop to save runtime complexity..
        # but this is easier to read/understand for the laymen

        term_string = term_string.replace('<option value','\n<option value').split('\n')[1:]
        term_array = []

        for term in term_string:
            # Edge case: the first one has a different html tag than the rest, so we accomodate
            if 'selected' in term:
                term_id = Helpers.find_between(Helpers, term, '<option value = "', '"')
                term_value = Helpers.find_between(Helpers, term, '{}" selected="selected">'.format(term_id), '</option')
            else:
                term_id = Helpers.find_between(Helpers, term, '<option value = "', '"')
                term_value = Helpers.find_between(Helpers, term, '{}" >'.format(term_id), '</option')
            term_array.append(
                {
                    "term_id": term_id,
                    "term_value": term_value
                }
            )

        return term_array

    @staticmethod
    def parse_classes_page(payload):
        # Grabs the raw HTML page from the endpoint
        raw_html_results = requests.post(ConfigObject.api_endpoint,data=payload).text

        # Replacement 1: Get rid of all new lines
        # Notes : I saw that "panel-heading.*" are the only differentiators when parsing through the results
        # Replacement 2: Every panel-heading piece will have a newline, for easier parsing
        # Split the results by the newline that were given, and skip the first line
        parsed_results = str(raw_html_results.replace("\n","").replace\
            ('<div class="panel-heading panel-heading-custom">',
             '\n<div class="panel-heading panel-heading-custom">')).replace('<br>',' ').split("\n")[1:]


        return_data = []
        for entries in parsed_results:

            # Grab relevant data, heavily relying on html elements ( this may change a lot as the HTML page changes )
            filtered_entry = Helpers.find_between(Helpers,entries,'<div class="panel-heading panel-heading-custom"><H2 style="margin:0px;">', 'Materials</a></div>')
            filtered_json = {}
            print( filtered_entry)
            descriptive_link = Helpers.find_between(Helpers, filtered_entry, 'href = "index.php?', '"')
            class_name = Helpers.find_between(Helpers, filtered_entry, '{}">'.format(descriptive_link), '</a>')
            class_id = Helpers.find_between(Helpers,filtered_entry,'<a id="','"').replace('class_id_','')

            # Parse into JSON document
            filtered_json['ClassID'] = class_id
            filtered_json['Course Name'] = class_name.replace('&nbsp;',' ')
            return_data.append(filtered_json)


        return return_data


class API():
    app = Flask('ucsc_courses')

    def __init__(self):

        pass



    @staticmethod
    @app.route('/api/v1.0/courses/all/2180', methods=['GET'])
    def courses_num():
        ConfigObject.logger.log_msg('Running the Open Courses API', 'INFO')
        default_payload = ConfigObject.default_payload

        # You can derive this payload using the Inspect Element feature, navigate to the Networks
        # tab, and then search for classes on https://pisa.ucsc.edu/class_search
        status = "all"
        num_of_results="2180"
        if 'all' in status.lower():
            reg_status = "all"
        else:
            return jsonify({
                'msg': 'Your only choices in this endpoint is /all'
            })
        
        bind_term = request.args.get('term', default=CourseParser.get_term_info()[0].get('term_id'), type=str)
        custom_payload = {
            "binds[:catalog_nbr_op]:": "=",
            "binds[:crse_units_op]:": "=",
            "binds[:instr_name_op]:": "=",
            "binds[:reg_status]:": str(reg_status),
            "binds[:term]:":bind_term,
            "rec_dur": num_of_results
        }

        # Combines two dictionaries together
        # See: https://stackoverflow.com/questions/38987/how-to-merge-two-dictionaries-in-a-single-expression
        open_courses_payload = {**default_payload, **custom_payload}

        # Parse resulting payload into the results object
        results = CourseParser.parse_classes_page(open_courses_payload)

        with open('output.txt', 'w') as f:
            f.write(str(results))

        return jsonify(results)



    ### error handling

    @staticmethod
    @app.errorhandler(404)
    def not_found(error):
        return   make_response(jsonify({'error': 'Not found'}), 404)

    def run(self, debug=True, port=5000):
        self.app.run(port=port, debug=debug)


if __name__ == '__main__':
    app = API()
    app.run()
