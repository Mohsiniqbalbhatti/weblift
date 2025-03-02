# Use the Ubuntu 20.04 (Focal Fossa) base image
FROM ubuntu:focal

# Update the package lists to fetch the latest versions
RUN apt-get update

# Install `curl` to download files over HTTP/HTTPS
RUN apt-get install -y curl

# Download and configure the NodeSource repository for Node.js v23.x
RUN curl -sL https://deb.nodesource.com/setup_23.x | bash -

# Upgrade all installed packages to their latest versions
RUN apt-get upgrade -y

# Install Node.js (version 23.x) using the configured repository
RUN apt-get install -y nodejs

# Install Git for version control and repository cloning
RUN apt-get install git -y

# Install dos2unix to convert Windows-style (CRLF) line endings to Unix (LF)
RUN apt-get install -y dos2unix

# Set the working directory inside the container to `/home/app`
WORKDIR /home/app

# Copy the `main.sh` script from the host to the container's working directory
COPY main.sh main.sh

# Convert line endings of main.sh from CRLF to LF (fixes exec format error)
RUN dos2unix /home/app/main.sh

# Copy the `script.js` file from the host to the container's working directory
COPY script.js script.js

# Copy both `package.json` and `package-lock.json` (if they exist)
COPY package*.json .
# Copy kafka.pem
COPY kafka.pem kafka.pem
# Copy .env
COPY .env .env
# Install Node.js dependencies defined in `package.json`
RUN npm install

# Make the `main.sh` script executable
RUN chmod +x /home/app/main.sh

# Make the `script.js` file executable (optional, depending on usage)
RUN chmod +x script.js

# Define the entrypoint command to run `/home/app/main.sh` when the container starts
ENTRYPOINT [ "/home/app/main.sh" ]