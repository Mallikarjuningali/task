pipeline {
    agent any

    environment {
        DOCKERHUB_USER = "mallikarjuningali"
    }

    stages {

        stage('Checkout') {
            steps {
                checkout scm
            }
        }

        stage('Build Backend Image') {
            steps {
                sh """
                docker build -t ${DOCKERHUB_USER}/crud-dd-backend:latest -f Dockerfile.backend .
                """
                sh """
                docker build -t ${DOCKERHUB_USER}/crud-dd-backend:${BUILD_NUMBER} -f Dockerfile.backend .
                """
            }
        }

        stage('Build Frontend Image') {
            steps {
                sh """
                docker build -t ${DOCKERHUB_USER}/crud-dd-frontend:latest -f Dockerfile.frontend .
                """
                sh """
                docker build -t ${DOCKERHUB_USER}/crud-dd-frontend:${BUILD_NUMBER} -f Dockerfile.frontend .
                """
            }
        }

        stage('Push to Docker Hub') {
            steps {
                withCredentials([usernamePassword(credentialsId: 'dockerhub-creds', usernameVariable: 'DH_USER', passwordVariable: 'DH_PASS')]) {
                    sh """
                    echo $DH_PASS | docker login -u $DH_USER --password-stdin

                    docker push ${DOCKERHUB_USER}/crud-dd-backend:latest
                    docker push ${DOCKERHUB_USER}/crud-dd-backend:${BUILD_NUMBER}

                    docker push ${DOCKERHUB_USER}/crud-dd-frontend:latest
                    docker push ${DOCKERHUB_USER}/crud-dd-frontend:${BUILD_NUMBER}

                    docker logout
                    """
                }
            }
        }

        stage('Deploy to VM') {
            steps {
                sshagent(['vm-ssh-key']) {
                    sh '''
                        VM_USER=ubuntu
                        VM_HOST=13.203.158.118
                        SSH_PORT=22
                        REMOTE_DIR=/home/ubuntu/crud-deploy

                        # Create directory on VM
                        ssh -o StrictHostKeyChecking=no -p $SSH_PORT $VM_USER@$VM_HOST "
                            mkdir -p $REMOTE_DIR
                        "

                        # Copy docker-compose.yml to VM
                        scp -o StrictHostKeyChecking=no -P $SSH_PORT docker-compose.yml $VM_USER@$VM_HOST:$REMOTE_DIR/

                        # Restart deployment
                        ssh -o StrictHostKeyChecking=no -p $SSH_PORT $VM_USER@$VM_HOST "
                            cd $REMOTE_DIR && docker compose pull && docker compose up -d
                        "
                    '''
                }
            }
        }
    }

    post {
        failure {
            echo "Pipeline failed."
        }
        success {
            echo "Pipeline executed successfully!"
        }
    }
}




