# Factored-test
Repository with the solution to the technical test from Factored

To open this project on windows based systems please follow carefully the next steps:

1. Download the files by clicking the "Code" button located in the top left and then "Download Zip".
2. Places the files in a folder that you know where its located.
3. Access that folder and unZip the project. You can do this by right clicking the downloaded folder and selecting the "Extract" option.
4. Inside the extracted folder will be the files needed to execute the project, but before this we need to install Docker.
5. To install Docker go to www.docker.com/products/docker-desktop/ and download Docker desktop.
6. Install Docker desktop, usually after this step you need to reboot your computer.
7. Open docker desktop
8. Go back to the folder where we left in step 4. In case you dont remember its called "Factored-test-main" and you should see two folders called backend, frontend, and some other files. Sometimes its another "Factored-test-main" inside the first folder, it depends on what you used to extract the zip initially.
9. Here we need to open a terminal. We can do this by right clicking somewhere inside this folder and selecting the option "Terminal" or "Open terminal"
10. Inside the terminal type "docker compose up" and wait for everything to load. You can check this by opening docker desktop and looking for a container called "factored-test-main". It should be colored in green,  gray means that is not running.
11. Open your preferred browser and go to http://localhost:3000/ to intereact with the project

Now you are ready to use the Emoployee management app. In the first window that opens you can register a user and login with those credentials. When a user is logged in you can add some skills and see them in the Radar Chart.
