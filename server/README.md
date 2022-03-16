# Server Setup

## XAMPP

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

Congrats! You have now set up the PHP server in your dev environment. Read on as there are a few more things to do in order to get everything working.

## Composer

Composer is a dependency management tool for PHP. [Instructions](https://getcomposer.org/doc/00-intro.md#introduction) to download Composer.

The actual dependencies are not committed to the repo so to download them you will need to run the following command `composer install` in the server directory.

Some dependencies may depend on certain PHP extensions such as the gd PHP extension. In XAMPP you can enable these extensions by navigating to your php.ini file.

<image src="./assets/xampp-php-config.png" alt="XAMPP PHP config">
<image src="./assets/xampp-php-ini.png" alt="XAMPP php.ini">

Once in the `php.ini` file you are going to want to find the line containing the
gd extension `;extension=gd` and remove the colon. You can then save the file
and restart your apache server to enable the changes.

## SQLite

The server uses SQLite to store the PAR data to make searching easier. Setting
up SQLite is simple with PHP, all you need to do is enable the `sqlite3`
extension. To do this simply navigate to the `php.ini` file (see above) and find
the line that reads `;extension=sqlite3`. Remove the colon, save the file, and
thenrestart your apache server to enable the changes.

When working with SQLite a helpful VSCode extension is the
[SQLite](https://marketplace.visualstudio.com/items?itemName=alexcvzz.vscode-sqlite)
extension which makes it easy to view the databse and query it.
