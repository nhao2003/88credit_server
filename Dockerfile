# Use the official Node.js latest image as the base image
FROM node:lts

# Set the working directory inside the container
WORKDIR /app

# Install dependencies
COPY package.json yarn.lock ./
RUN yarn install

# Copy the rest of the application code
COPY . .

# Generate Prisma client
RUN yarn prisma generate

# Build the application
RUN yarn build

# Set the environment variables
ENV RABBITMQ_HOST=rabbitmq

# Expose the port the app runs on
EXPOSE 5555

# Serve the app
CMD ["yarn", "preview"]