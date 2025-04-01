FROM ubi8/nodejs-20
 
# Add application sources
 
WORKDIR /opt/app-root/src
 
ADD . .
 
# Install the dependencies
RUN npm install
 
# Run script uses standard ways to run the application
CMD npm run -d start --port 3001
