# JustGiving FED coding exercise #

This repository contains a node-based backend and structure to create a web page that interrogates a very simple read/write JG-like backend.

You need to set up this server and build your page on top of it. If you are not fluent in node, don't worry! This is very straightforward and should only take you a few minutes.

## The exercise ##

We want to see your code!

At JustGiving we are crazy about good front end code and good front end principles. We'd like you to implement an interface from a typical page that you would build, but one that shows us the absolute best of your knowledge, including what you consider to be relevant in the field.

In the specs folder, you'll find a png with the designs of the crowdfunding widget. We want you to implement that widget. Please submit and retrieve the pages using asynchronous calls to the backend provided.

Even though this is only an exercise, we want to see code that could be on production, so please consider this when making decisions about the project scalability, performance, accessibility and integration, etc.

Remember this widget could be used on third party websites, so take into account this when making decisions on the technologies that you use and how to implement them to optimise the page in these cases as well.

You can pick any technology that is relevant for the exercise as long as you are prepared to justify your choices.

*One important thing, though, is that we want to see your HTML, CSS and Javascript skills, so chose your libraries wisely to showcase what you know. We want to see **your** code. We discourage you, for instance, from using CSS frameworks.*

*If you don't have time to build everything you’d like, please prioritise the most important aspects and explain how you would implement the rest.*


## Setup ##

* Install node on your computer if you haven't already (http://nodejs.org/)
* Clone this repository on your computer
* In the terminal, go to the root directory of the repository
* Run `npm install` (without the backquotes) to install dependencies
* Run `npm start` to run the server

You should now be running the server on port 3000.


## The server ##

The server defines three endpoints, two for the REST API and one for the base page of the app.

* **localhost:3000/** — should display a basic page with some very basic HTML
* **GET localhost:3000/crowdFundingPage** — displays all the fundraisers in JSON format
* **PUT localhost:3000/pledge/{pledgeAmount}** — submits a pledge from the user, the pledge amount is passed as part of the url

### Bonus points ###
The server will generate random errors. 10% of the time you should receive a 500 error for the PUT request and that means the pledge was not processed. An optional part of this exercise is dealing with the error in a useful manner.

## Creating pages ##

The following directories are already set up

* **/assets** — Contains subdirectories to store sources for styles, images and scripts. Feel free to create more if it fits your needs
* **/views** — Contains a sample html file you can write your code on


If you point your browser to 'http://localhost:3000' you should see text from a sample file.
That file lives inside the 'views' folder and is a plain HTML file. You can write your markup right there.

The assets folder is where you can put your your static assets, such as CSS, Javascript and images.
Folders inside of 'assets' are mapped at the root of the server. For example, a file inside the 'assets/css' folder
may be accessed at 'http://localhost:3000/css/styles.css' and a file inside the 'assets/images' folder may be accessed
at 'http://localhost:3000/images/my-image.png'.

Feel free to delete, create or rename folders as you need.

You don't need to look into or change the server code, but if you are comfortable doing it, you are most welcome to it.

Good luck!