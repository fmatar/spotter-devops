# BeatSheet Exercise Starter
Following the suggestion from our interview, I focused on doing one part of the assignment in a novel way. I created a click-and-drag interface for specifying the time range of a beat in an act. Hover over the timeline bar to select a start position, and click and drag to add a beat with that time range. I don't think this interaction makes sense for content creators, as beats probably should not be able to overlap, but my goal was to create an interface that wasn't all boxes, and this ui accomplished that. I had to time-box this as I could keep refining it forever, and I want to keep this process moving. A lot more could be done to improve this app in terms of style and experience. I've included a non-exhaustive to-do list below.

## Todos: 
 - Style for mobile
 - handle creating and deleting acts
 - handle updating beats
 - add the time range on to the drag button as it updates
 - handle dragging the button behind the starting click location
 - handle extending the time range of an act
 - fix bug that prevents sliding to the exact end time of an act
 - smooth out toggling between beats that overlap densly, it can flicker back and forth in frustrating way
 - improve styling of the popup window for adding beat details

 ## Running the app
 1. Make sure the backend is running, this can be done by following the instructions below.
 2. in your terminal make sure you are in the `./beetsheet-ui` directory.
 3. install the dependencies using `npm i`
 4. run the development server using `npm run dev`
 5. navigate to `http://localhost:3000`

## Area of focus
The main interaction I focused on for this is illustrated in this [video
](https://www.loom.com/share/108d04cf05d84fe0a100ddef6a5ee7ce?sid=d3ce0da1-e823-4157-98c3-03ef948f574b)



## DOCKER INSTRUCTIONS

This guide provides instructions on how to run the beetsheet backend in a docker container.

## Requirements

To use this Docker container, you will need to have Docker installed on your system. If you do not have Docker installed, you can download it from [here](https://www.docker.com/products/docker-desktop).

## How to Run Docker Compose

Run the following command to create the Docker container:

```bash
docker compose create
```

Run the following command to start the Docker container:

```bash
docker compose start
```

Alternatively, you can create and start the container by running:

```bash
docker compose up
```

This command will start the Docker container defined in the `docker-compose.yml` file. The BeatSheet API will be accessible at the port defined in the `docker-compose.yml` file.

## Stopping and Removing Containers

To stop the Docker container, you can run:

```bash
docker compose stop
```

This command will stop the running Docker container.

If you also want to remove the Docker container after stopping it, you can run:

```bash
docker compose down
```

This command will stop and remove the Docker container. Please note that any data not stored in a volume will be lost.

## Notes

Please ensure that the port defined in the `docker-compose.yml` file is not being used by any other applications to avoid any port conflict.
