# Robotics GUI
This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 17.3.4.

# Install dependencies
After cloning the repo, from the root of the directory, run
`npm install`. It should install all required packages.

# Setup
To your `/etc/hosts/` file on your client (ie where
you are viewing the camera stream), add the following
line:
`10.240.0.100   cameras.local`
Where the first part is the IP of the rover, and the
second is a domain name, which is hardcoded in `connection_info.ts`.
Note there is a **tab** between the two lines.

# Run the server
In one terminal
run `ts-node src/server.ts` or `npm run server`. You should see
`Server is listening on https://localhost:5000`. Currently, the server is responsible for broadcasting video streams to all connected clients.

# Run the GUI (locally)
Run `ng serve --host 0.0.0.0 --port 4200 --ssl` or `npm run gui`. Using the `--ssl` option will force an HTTPS connection, which is required for the cameras. We note the use of the self-signed 
SSL certificates, in the ./ssl directory. Thus, opening any pages will give us warnings! TODO : Get a proper CA issued SSL certificate.
The `--host` option allows this server to accept connections from outside of
localhost (ie: the basestation).

Note that the certificate (cert.pem) **needs** to be added to your browsers
(inclusing the basestation).
In chrome, this is in "Authorities" tab of "Manage certificates".

Note the warning `The 'module' option will be set to 'ES2022' instead'`. This is from tsconfig.json, in the line `"module": "commonjs"`.
Without this, (if we just did the standard `"module" : "ES2022"`), I cant' run do the `ts-node server.ts` command. Hence, dirty fix

# Run the server and the GUI concurrently,
Run `npm run dev`. This npm script starts the backend server using ts-node and then, after a brief pause, starts the frontend GUI using ng serve.

# How to operate
For the cameras to work, open one window as such
https://localhost:4200/server. Select your camera, if prompted.
For the everything else to work, in another window as such
https://localhost:4200`. Also, please use google chrome or chromium, I had a lot of issues with firefox

# A note on the cameras
The current system will detect all video cameras that are plugged into the jetson and broadcast them to all connected clients. If you don't want a certain camera to transmit (like the ZED2), you will have to go to enumerateMediaDevices() in video-server.component.ts and check the device you are enumerating over ! Lastly, there is no 'automatic' HTML video system, the html video elements are hardcoded to support a certain number of cameras. Right now theres 4, (in video-client.component.html), so if you want fewer than 4 then you will manually have to remove the HTML video elements.  

# Running the GUI on a non-local IP
To be discussed...


