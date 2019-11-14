const AWS = require('aws-sdk')

const ecs = new AWS.ECS({'region': 'us-east-1'})

const createTaskAndService = (branch, clusterName) => {
  const taskParams = {
    family: 'nypl-design-system-dev-environments',
    taskRoleArn: 'ecsTaskExecutionRole',
    executionRoleArn: 'ecsTaskExecutionRole',
    networkMode: 'awsvpc',
    cpu: '512',
    memory: '1024',
    requiresCompatibilities: ['FARGATE'],
    tags: [{
      key: 'project',
      value: 'nypl-design-system'
    }],
    containerDefinitions: [
      {
        name: 'twig-storybook',
        image: `224280085904.dkr.ecr.us-east-1.amazonaws.com/nypl-design-system-twig:${branch}`,
        portMappings: [{
          containerPort: '8001',
          hostPort: '8001',
          protocol: 'tcp',
        }]
      },
      {
        name: 'react-storybook',
        image: `224280085904.dkr.ecr.us-east-1.amazonaws.com/nypl-design-system-react:${branch}`,
        portMappings: [{
          containerPort: '9001',
          hostPort: '9001',
          protocol: 'tcp',
        }]
      },
    ]
  }
  
  let taskArn
  
  ecs.registerTaskDefinition(taskParams, (err, data) => {
    if (err) console.log(err, err.stack)
    else {
      console.log(data)
      taskArn = data.taskDefinition.taskDefinitionArn
  
      const serviceParams = {
        serviceName: `nypl-design-system-branch-${branch}`,
        cluster: clusterName,
        deploymentController: {
          type: 'ECS',
        },
        launchType: 'FARGATE',
        taskDefinition: taskArn,
        desiredCount: 1,
        networkConfiguration: {
          awsvpcConfiguration: {
            subnets: ['subnet-be4b2495', 'subnet-4aa9893d'],
            assignPublicIp: 'ENABLED',
            securityGroups: ['sg-0063f1152211592d9']
          }
        }
      }
  
      ecs.createService(serviceParams, (err, data) => {
        if (err) console.log(err, err.stack)
        else {
          console.log(data)
          return data.service.serviceArn
        }
      })
    }
  })
}

createTaskAndService('SFR-616_Incorporate_breadcrumbs', 'nypl-design-system-development')

module.exports = { createTaskAndService }
