const AWS = require('aws-sdk')
const Docker = require('dockerode')
const url = require('url')

const docker = Docker()

const imageBaseName = 'nypl-design-system' 
const branchName = process.argv[2]

const createImage = async (typeName, type, branch) => {
  console.log(typeName, type, branch)
  const imageStream = await docker.buildImage(
    { context: __dirname, src: ['Dockerfile'], },
    { t: typeName, buildargs: { build_branch: branch, type } }
  )
  await new Promise ((resolve, reject) => {
    docker.modem.followProgress(imageStream, (err, res) => {
      err ? reject(err) : resolve(res)
    })
  })
}

const createImages = async (imageBase, branch, creds) => {
  const images = []
  const types = ['react', 'twig']
  await types.map(async (env) => {
    const typeName = `${imageBase}-${env}`
    images.push(typeName)
    await createImage(typeName, env, branch)
  
    const typeTag = `224280085904.dkr.ecr.us-east-1.amazonaws.com/${typeName}`
    let imageInfo
    try {
      imageInfo = await docker.getImage(typeName)
      await imageInfo.tag({
        repo: typeTag,
        tag: branch,
      })
      
      remoteImage = await docker.getImage(typeTag)

      await remoteImage.push({ tag: branch, authconfig: creds }, (err, resp) => {
        resp.pipe(process.stdout)
        console.log(err)
      })
    } catch (err) {
      console.log(err)
    }
  });
  return images
}

const createECRRepos = async (client, baseName) => {
  client.createRepository({ repositoryName: `${baseName}-twig`, tags: [{ Key: 'project', Value: 'design_system'}]}, (err, data) => {
    if (err.code !== 'RepositoryAlreadyExistsException') throw err
  })
  client.createRepository({ repositoryName: `${baseName}-react`, tags: [{ Key: 'project', Value: 'design_system'}]}, (err, data) => {
    if (err.code !== 'RepositoryAlreadyExistsException') throw err
  })
}

const getAuthCreds = async (client) => {
  const authData = await client.getAuthorizationToken().promise()
  const authInfo = authData.authorizationData[0]
  const [user, pswd] = Buffer.from(authInfo.authorizationToken, 'base64').toString().split(':')
  return {
    username: user,
    password: pswd,
    serveraddress: url.parse(authInfo.proxyEndpoint).host
  }
}

const main = async () => {
  let newImages
  
  const ecrClient = new AWS.ECR({ region: 'us-east-1' })
  createECRRepos(ecrClient, imageBaseName)
  
  const creds = await getAuthCreds(ecrClient)
  console.log(creds)
  try {
    newImages = await createImages(imageBaseName, branchName, creds)
  } catch (err) {
    console.log(err)
  }
  
  console.log(newImages)
}

main()
// Also create a script that can spin down a specific branch's task