FROM ubi8/nodejs-20

USER 0


# Add application sources
 
WORKDIR /opt/app-root/src
 
ADD . .
USER 1001
# Install the dependencies
RUN npm install

# Run script uses standard ways to run the application
CMD npm run -d start --port 3001