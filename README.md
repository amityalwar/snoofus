# Snoofus

Snoofus is a Speech Analyzer that allows users to record their speech and receive feedback on the quality of their speech in terms of clarity, confidence and fluency. Snoofus also provides the count of filler words (disfluencies) such as uh, ummm, ah, etc., you use in your speech. Under the hood, Snoofus uses OpenAI's "tiny.en" Whisper model for converting speech to text. The text is then processed by GPT-4 to provide the analysis of the speech. 

Snoofus will give you great feedback on your speech but there are several aspects of speech not captured by this furry overlord. Eye contact, long pauses, body language and other visual cues that communicate a lot about your speech are not considered in the analysis provided.

## Features

- **Live Audio Recording**: Users can record their speech directly through the browser.
- **Speech Analysis**: After recording, users can analyze their speech to receive feedback on clarity and confidence.
- **File Management**: Users can save, rename, and delete their recordings. They can also listen to previous recordings.
- **Interactive UI**: The web application provides a user-friendly interface, complete with modals for user actions and confirmation prompts.

## Demo

1. **Good Speech**: [Barack Obama](https://www.youtube.com/watch?v=h5gNSHcoVmQ)

https://github.com/amityalwar/snoofus/assets/24665860/f3427368-60c2-4b4d-80fc-41fe4177fac1

2. **Bad Speech**: [Richard Hendricks](https://www.youtube.com/watch?v=-mSiJyU5aiM)

https://github.com/amityalwar/snoofus/assets/24665860/d9591b03-37d9-473a-9311-52108c9dd1a5


## UI Screenshots

First Screen

<img width="873" alt="SCR-20230926-lbud" src="https://github.com/amityalwar/snoofus/assets/24665860/8ae7dea1-61d4-4b06-aeff-dbae54dea5b9">


Analysis of a live speech recording of "What is the meaning of Life?"

<img width="867" alt="SCR-20230926-lfyv" src="https://github.com/amityalwar/snoofus/assets/24665860/a16ba366-634c-4e53-94a6-eca26f05a676">

## Usage

1. **Recording Speech**: Click on the "Start Recording" button to start recording your speech. Once done, click on "Stop Recording". After stopping, you'll be prompted to name your recording.
2. **Analysis**: From the dropdown, select a recording and click "Analyze" to get feedback on your speech.
3. **Playback & Management**: Use the dropdown to select previous recordings for playback. You can also delete individual recordings or all recordings at once.

## Setup & Installation

1. **Clone the Repository**

   ```bash
   git clone https://github.com/amityalwar/snoofus.git
   cd snoofus
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

## License

This project is licensed under the MIT License. See [LICENSE](https://github.com/git/git-scm.com/blob/main/MIT-LICENSE.txt) for more details.
