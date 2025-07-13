# Google Minesweeper Scripts
A collection of scripts for the [Google Minesweeper](https://www.google.com/fbx?fbx=minesweeper) game.  
(It also works on the Google search version of the [game](https://www.google.com/search?q=minesweeper)).  
# Speedrun Timer
The purpose of this script is to add a more speedrunning oriented timer to the existing game.  
The new timer is able to show the exact milliseconds that the game is stopped (either because of the player winning, losing or changing difficulty).  
The timer is physically hooking into the game to determine when it should start and stop, **BUT** it does not affect any other aspect of the actual game.  

# Left Click to chord
As the name implies, this script simply allows one to chord without having to press both the left and right mouse buttons (or the scroll wheel for that matter).  
This is a feature that many other minesweeper versions have, and I thought it would be nice to have it in the Google version as well 😁

# How to use

1. Developer Console  
One could simply just copy the source code from the **.js** files found in the repository and pasting them in the developer console of any *relatively* modern browser.  
While this is a nice way to give the scripts a quick test (to see if one likes them or not), it really is not the recommended way to go about using them.  
2. Using Bookmarklets  
This is *in my opinion* the recommended way of using these scripts.  
All you have to do is copy the source code from the **.txt** files found in the repository (these have been minified and formatted appropriately) and create a bookmark using the coped source in the **URL** field.  
Then all you have to do is click on the bookmark while the game is loaded and the script will start automatically.  
3. Using UserScripts  
This is the more advanced and is recommended for those familiar with said technology.  
Using this method, the scripts can always be active any time the website is visited.  
One needs to have an appropriate extension installed (something like [Tampermonkey](https://www.tampermonkey.net/) or [Greasemonkey](https://www.greasespot.net/)) and then go through the appropriate steps to incorporate the scripts.  
The process it not very hard, but it goes beyond the scope of this repository.  
For more info on the usage of Userscripts, you can visit this [website](https://simply-how.com/enhance-and-fine-tune-any-web-page-the-complete-user-scripts-guide).
