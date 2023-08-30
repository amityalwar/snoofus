# Snoofus Speech Analyzer

Snoofus Speech Analyzer is a web-based tool that allows users to record their speech and receive feedback on the quality of their speech in terms of clarity and confidence.

## Features

- **Live Audio Recording**: Users can record their speech directly through the browser.
- **Speech Analysis**: After recording, users can analyze their speech to receive feedback on clarity and confidence.
- **File Management**: Users can save, rename, and delete their recordings. They can also listen to previous recordings.
- **Interactive UI**: The web application provides a user-friendly interface, complete with modals for user actions and confirmation prompts.

## Setup & Installation

1. **Clone the Repository**

   ```bash
   git clone https://github.com/your_username/snoofus_speech_analyzer.git
   cd snoofus_speech_analyzer
   ```

2. **Set Up OpenAI API Key**

   Create a file named `config.py` in the main project directory. Add your OpenAI API key as follows:

   ```python
   OPENAI_API_KEY = 'your_openai_key_here'
   ```

   Make sure to add `config.py` to your `.gitignore` to ensure it's not tracked by Git:

   ```bash
   echo "config.py" >> .gitignore
   ```

3. **Set Up a Virtual Environment (Recommended)**

   ```bash
   python -m venv venv
   source venv/bin/activate  # On Windows, use `venv\\Scripts\\activate`
   ```

4. **Install Required Packages**

   ```bash
   pip install -r requirements.txt
   ```

5. **Run the Application**

   ```bash
   python app.py
   ```

   The application will start and should be accessible at `http://127.0.0.1:5000/`.

## Usage

1. **Recording Speech**: Click on the "Start Recording" button to start recording your speech. Once done, click on "Stop Recording". After stopping, you'll be prompted to name your recording.
2. **Analysis**: From the dropdown, select a recording and click "Analyze" to get feedback on your speech.
3. **Playback & Management**: Use the dropdown to select previous recordings for playback. You can also delete individual recordings or all recordings at once.

## Contributing

If you'd like to contribute, please fork the repository and create a pull request. We'd love to merge your changes into the main project!

## License

This project is licensed under the MIT License. See [LICENSE](LICENSE) for more details.