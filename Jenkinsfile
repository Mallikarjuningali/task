pipeline {
  agent any

  environment {
    BACKEND = "mallikarjuningali/crud-dd-backend"
    FRONTEND = "mallikarjuningali/crud-dd-frontend"
    IMAGE_TAG = "${env.BUILD_ID}"
  }

  stages {
    stage('Checkout') {
      steps { checkout scm }
    }

    stage('Build Backend Image') {
      steps {
        sh "docker build -t ${BACKEND}:latest -f Dockerfile.backend ."
        sh "docker build -t ${BACKEND}:${IMAGE_TAG} -f Dockerfile.backend ."
      }
    }

    stage('Build Frontend Image') {
      steps {
        sh "docker build -t ${FRONTEND}:latest -f Dockerfile.frontend ."
        sh "docker build -t ${FRONTEND}:${IMAGE_TAG} -f Dockerfile.frontend ."
      }
    }

    stage('Push to Docker Hub') {
      steps {
        withCredentials([usernamePassword(credentialsId: 'dockerhub-creds', usernameVariable: 'DH_USER', passwordVariable: 'DH_PASS')]) {
          sh '''
            echo "$DH_PASS" | docker login -u "$DH_USER" --password-stdin
            docker push ${BACKEND}:latest
            docker push ${BACKEND}:${IMAGE_TAG}
            docker push ${FRONTEND}:latest
            docker push ${FRONTEND}:${IMAGE_TAG}
            docker logout
          '''
        }
      }
    }

    stage('Deploy to VM') {
    steps {
        sshagent(['vm-ssh-key']) {
            sh '''
                VM_USER=ubuntu
                VM_HOST=13.200.246.8
                SSH_PORT=22
                REMOTE_DIR=/var/lib/jenkins/crud-deploy

                ssh -o StrictHostKeyChecking=no -p $SSH_PORT $VM_USER@$VM_HOST "
                    mkdir -p $REMOTE_DIR
                "

                scp -o StrictHostKeyChecking=no -P $SSH_PORT docker-compose.yml $VM_USER@$VM_HOST:$REMOTE_DIR/

                ssh -o StrictHostKeyChecking=no -p $SSH_PORT $VM_USER@$VM_HOST "
                    cd $REMOTE_DIR && docker compose pull && docker compose up -d
                "
            '''
        }
    }
}


  post {
    success { echo "Pipeline succeeded." }
    failure { echo "Pipeline failed." }
  }
}


