terraform {
  required_providers {
    docker = {
      source = "kreuzwerker/docker"
    }
  }
}

provider "docker" {}

resource "docker_image" "postgres" {
  name = "postgres:latest"
}

resource "docker_container" "postgres" {
  name  = "postgres"
  image = docker_image.postgres

  ports {
    internal = 5432
    external = 5432
  }

  env = [
    "POSTGRES_USER=admin",
    "POSTGRES_PASSWORD=admin",
    "POSTGRES_DB=mydb"
  ]

  volumes {
    container_path = "/var/lib/postgresql/data"
    host_path = "/tmp/postgres"
  }
}