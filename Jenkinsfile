pipeline {

  agent any

  triggers {
    pollSCM('*/3 * * * *')
  }

  environment {
    AWS_ACCESS_KEY_ID = credentials('awsAccessKeyId')
    AWS_SECRET_ACCESS_KEY = credentials('awsSecretAccessKey')
    AWS_DEFAULT_REGION = 'ap-northeast-2'
    HOME = '.'
    ACCESS_TOKEN = credentials('githubToken')
  }

  stages {
    // 레포지토리를 다운르드 받음
    stage('Prepare') {
      agent any

      steps {
        echo 'Clonning Repository'

        git url: 'https://github.com/ctak/jenkins-tutorial.git',
          branch: 'main',
          credentialsId: 'aws-jenkins'
      }

      post {
        success {
          echo "Successfully Clonned Repository"
        }

        always {
          echo "I tried..."
        }

        cleanup {
          echo "after all other post condition"
        }
      }
    }

    // aws s3 에 파일을 올림
    stage('Deploy Frontend') {
      steps {
        echo 'Deploying Frontend'
        // 프론트엔드 디렉토리의 정적파일들을 S3 에 올림, 이 전에 반드시 EC2 instance profile 을 등록해야 함.
        dir ('./website') {
          sh '''
          aws s3 sync ./ s3://t-2021-frontend
          '''
        }
      }

      post {
        success {
          echo 'Successfully Cloned Repository'

          mail to: 'tdashsoft2021@gmail.com',
            subject: 'Deploy Frontend Success',
            body: 'Successfully deployed frontend!'
        }
        failure {
          echo 'I failed :('

          mail to: 'tdashsoft2021@gmail.com',
            subject: 'Failed Pipeline',
            body: 'Something is wrong with deploy frontend'
        }
      }
    }

    stage('Lint Backend') {
      agent {
        docker {
          image 'node:latest'
        }
      }

      steps {
        dir ('./server') {
          sh '''
          npm install &&
          npm run test
          '''
        }
      }
    }

    stage('Test Backend') {
      agent {
        docker {
          image 'node:latest'
        }
      }

      steps {
        echo 'Test Backend'

        dir ('./server') {
          sh '''
          npm install
          npm run test
          '''
        }
      }
    }

    stage('Build Backend') {

      agent any
      steps {
        echo 'Build Backend'

        dir ('./server') {
          sh '''
          docker build . -t server --build-arg env=${PROD}
          '''
        }
      }

      post {
        failure {
          error 'This pipeline stops here...'
        }
      }

    }

    stage('Deploy Backend') {
      agent any

      steps {
        echo 'Build Backend'

        dir ('./server') {
          sh '''
          docker rm -f $(docker ps -aq)
          docker run -p 80:80 -d server
          '''
        }
      }

      post {
        success {
          mail to: 'tdashsoft2021@gmail.com',
            subject: 'Deploy Success',
            body: 'Successfully deployed!'
        }
      }
    }
  }

}
