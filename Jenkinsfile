pipeline {
  agent { docker { image 'node:alpine' } }
  stages {
    stage('build') {
      environment { HOME="." }
      steps {
        sh 'npm install'
      }
    }
    stage('test') {
      steps {
        sh 'npm run test'
      }
    }
  }
}
