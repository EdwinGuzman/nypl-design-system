const AWS = require('aws-sdk')


const getTaskENI = (clusterName, serviceArn) => {
  const ecs = new AWS.ECS({'region': 'us-east-1'})
  
  const taskSets =  {
    cluster: clusterName,
    service: serviceArn
  }
  
  ecs.describeTaskSets(taskSets, (err, data) => {
    if (err) console.log(err, err.stack)
    else {
      const taskID = data.taskSets[0].id
      const taskDesc = {
        cluster: clusterName,
        tasks: [taskID]
      }
      ecs.describeTasks(taskDesc, (err, data) => {
        if (err) console.log(err, err.stack)
        else {
          return data.tasks[0].attachments[0].details.eniId
        }
      })
    }
  })
}

const getPublicDomain = (eniID) => {

  const ec2 = new AWS.EC2({'region': 'us-east-1'})
  
  ec2.describeNetworkInterfaces({'NetworkInterfaceIds': [eniID]}, (err, data) => {
    if (err) console.log(err, err.stack)
    else {
      const assoc = data.NetworkInterfaces[0].Association
      return assoc.PublicIp, assoc.PublicDnsName
    }
  })
}

module.exports = {
  getTaskENI,
  getPublicDomain,
}