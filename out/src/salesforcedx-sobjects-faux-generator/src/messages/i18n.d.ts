/**
 * Conventions:
 * _message: is for unformatted text that will be shown as-is to
 * the user.
 * _text: is for text that will appear in the UI, possibly with
 * decorations, e.g., $(x) uses the https://octicons.github.com/ and should not
 * be localized
 *
 * If ommitted, we will assume _message.
 */
export declare const messages: {
    faux_generation_cancelled_text: string;
    failure_fetching_sobjects_list_text: string;
    failure_in_sobject_describe_text: string;
    no_sobject_output_folder_text: string;
    fetched_sobjects_length_text: string;
    no_generate_if_not_in_project: string;
    class_header_generated_comment: string;
};
