# Robotics GUI
This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 17.3.4.

# Install dependencies
After cloning the repo, from the root of the directory, run
`npm install`. It should install all required packages

# Run the server
In one terminal
run `ts-node server.ts`. You should see
`Server is listening on https://localhost:5000`. Currently, the server is responsible for broadcasting video streams to all connected clients.

# Run the GUI (locally)
Run `ng serve --ssl`. Using the `--ssl` option will force an HTTPS connection, which is required for the cameras. We note the use of the self-signed 
SSL certificates, in the ./ssl directory. Thus, opening any pages will give us warnings! TODO : Get a proper CA issued SSL certificate.

Note the warning `The 'module' option will be set to 'ES2022' instead'`. This is from tsconfig.json, in the line `"module": "commonjs"`.
Without this, (if we just did the standard `"module" : "ES2022"`), I cant' run do the `ts-node server.ts` command. Hence, dirty fix 

# How to operate
For the cameras to work, open one window as such
https://localhost:4200/server. Select your camera, if prompted.
For the everything else to work, in another window as such
https://localhost:4200`. Also, please use google chrome or chromium, i had alot of issues with firefox



# Running the GUI on a non-local IP
To be discussed...


