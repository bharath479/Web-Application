provider "google" {
  project = var.project_id
  region = var.region
  credentials = var.credentials
}

data "google_service_account" "service-account" {
    account_id = var.service_account_email
}

resource "google_project_service" "run_api" {
  service = "run.googleapis.com"
}

resource "google_cloud_run_v2_service" "app" {
  name     = var.service_name
  location = var.region

  template {
    service_account = data.google_service_account.service-account.email

    containers {
      image = var.image  # points to existing :latest image

      resources {
        limits = {
          cpu    = "1"
          memory = "512Mi"
        }
      }
    }

    scaling {
      min_instance_count = 0
      max_instance_count = 5
    }
  }

  depends_on = [
    google_project_service.run_api,
    google_project_service.artifact_api
  ]
}

output "name" {
  value = google_cloud_run_v2_service.app.name
}