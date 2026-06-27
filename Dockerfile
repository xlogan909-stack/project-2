FROM node:24.0.0-alpine
WORKDIR /app
COPY package*.json .
RUN npm i
COPY . .


ARG VITE_SPOONACULAR_API_KEY
ENV VITE_SPOONACULAR_API_KEY=$VITE_SPOONACULAR_API_KEY

EXPOSE 5173
CMD ["npm", "run", "dev", "--", "--host"]
