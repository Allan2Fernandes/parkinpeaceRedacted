pipeline {
    agent any
    environment {
        CI = 'false'
        JENKINS_NODE_COOKIE = 'dontKillMe /usr/bin/tmux'
    }
    stages {       

      
        stage('Build') {
            steps{
                echo 'Building'
                nodejs(configId: 'ee5cf6b7-351d-4577-adf4-97164953b7c8', nodeJSInstallationName: 'Nodejs1') {
                    // Install project dependencies
                    sh 'npm install'

                    // Build the project
                    sh 'npm run build'
                }
                
            
            }
        }


        stage('Test') {
          steps{
                echo 'Testing'
            }
        }

        stage('Deploy') {
            steps{
                echo "Deploying"
                
                nodejs(configId: 'ee5cf6b7-351d-4577-adf4-97164953b7c8', nodeJSInstallationName: 'Nodejs1') {
                    // some block
                    sh 'npm install -g serve'
                    sh 'pkill -f "serve -s build" || true'
                    sh 'nohup serve -s build &'
                    
                    //sh '''tmux new-session -d -s FrontEndBuild 
                    //tmux ls
                    //tmux send-keys -t FrontEndBuild \\'serve -s build\\' C-m'''
                }
              
            }
        }
    }
}