pipeline {
  agent { docker { image 'node:alpine' } }
  stages {
    stage('build') {
      steps {
        sh 'npm --version'
      }
    }
    stage('test') {
      steps {
        sh 'echo asdf'
      }
    }
  }
}
