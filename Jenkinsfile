pipeline {
  agent any

  environment {
    DOCKER_BACKEND = "mallikarjuningali/crud-dd-backend"
    DOCKER_FRONTEND = "mallikarjuningali/crud-dd-frontend"
    IMAGE_TAG = "${env.BUILD_ID}"  // unique tag per build
  }

  stages {
    stage('Checkout') {
      steps {
        checkout scm
      }
    }

    stage('Build Backend Image') {
      steps {
        sh "docker build -t ${DOCKER_BACKEND}:latest -f Dockerfile.backend ."
        sh "docker build -t ${DOCKER_BACKEND}:${IMAGE_TAG} -f Dockerfile.backend ."
      }
    }

    stage('Build Frontend Image') {
      steps {
        sh "docker build -t ${DOCKER_FRONTEND}:latest -f Dockerfile.frontend ."
        sh "docker build -t ${DOCKER_FRONTEND}:${IMAGE_TAG} -f Dockerfile.frontend ."
      }
    }

    stage('Push Images to Docker Hub') {
      steps {
        withCredentials([usernamePassword(credentialsId: 'dockerhub-creds', usernameVariable: 'DH_USER', passwordVariable: 'DH_PASS')]) {
          sh '''
            echo "$DH_PASS" | docker login -u "$DH_USER" --password-stdin
            docker push ${DOCKER_BACKEND}:latest
            docker push ${DOCKER_BACKEND}:${IMAGE_TAG}
            docker push ${DOCKER_FRONTEND}:latest
            docker push ${DOCKER_FRONTEND}:${IMAGE_TAG}
            docker logout
          '''
        }
      }
    }

    stage('Deploy to VM (SSH)') {
      steps {
        // Use SSH Agent plugin with credential id 'vm-ssh-key'
        sshagent (credentials: ['vm-ssh-key']) {
          sh '''
            VM_USER="ubuntu"
            VM_HOST="YOUR_VM_PUBLIC_IP"
            SSH_PORT=22
            REMOTE_DIR=~/crud-deploy

            ssh -o StrictHostKeyChecking=no -p $SSH_PORT $VM_USER@$VM_HOST << 'EOF'
              mkdir -p $REMOTE_DIR
              cd $REMOTE_DIR
              # make sure docker compose file and nginx folder are present on VM in REMOTE_DIR
              # Pull latest images and restart services:
              docker compose pull
              docker compose up -d --remove-orphans
            EOF
          '''
        }
      }
    }
  } // stages

  post {
    success {
      echo "Pipeline finished successfully."
    }
    failure {
      echo "Pipeline failed."
    }
  }
}
