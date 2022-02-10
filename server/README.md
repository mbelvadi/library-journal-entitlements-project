# PHP Server

## Setup

### Dev Environment

The following steps outline how to set up the PHP server on windows using XAMPP (tested on windows 11, should be identical for windows 10).

1. Download [XAMPP](https://www.apachefriends.org/index.html)

   In order to run the PHP server locally you will need apache and php. Downloading XAMPP provides you with both although there other option out there if you prefer.

2. Start Apache Server

   Once you have XAMPP downloaded you are going to want to open it up and start the APACHE server.

   <image src="./assets/xampp-start-apache.png" alt="Start apache XAMPP">

3. Clone Repo into htdocs folder

   the htdocs folder will can be found in `~/xampp/htdocs`. You can get to this by clicking on the explorer button within XAMPP.

   <image src="./assets/xampp-explorer.png" alt="XAMPP explorer button">

4. Once you clone the repository you should be able to to navigate to `localhost/{project-folder-name}` (replace project-folder-name) with whatever you call the folder the proejct lives in) and you will see a screen like this:

   <image src="./assets/apache-server.png" alt="XAMPP explorer button">

Congrats! You have now set up the PHP server in your dev environment.