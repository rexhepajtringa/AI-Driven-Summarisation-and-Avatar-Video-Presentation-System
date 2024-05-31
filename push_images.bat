@echo off

REM Build images
docker-compose build

REM Tag images
docker tag text-to-voice:latest trexhepaj/text-to-voice:latest
docker tag avatar-video-service:latest trexhepaj/avatar-video-service:latest
docker tag trexhepaj/mmv-naming-server:0.0.1-SNAPSHOT trexhepaj/mmv-naming-server:0.0.1-SNAPSHOT
docker tag trexhepaj/mmv-document-handling-service:0.0.1-SNAPSHOT trexhepaj/mmv-document-handling-service:0.0.1-SNAPSHOT
docker tag trexhepaj/mmv-api-gateway:0.0.1-SNAPSHOT trexhepaj/mmv-api-gateway:0.0.1-SNAPSHOT
docker tag trexhepaj/mmv-spring-cloud-config-server:0.0.1-SNAPSHOT trexhepaj/mmv-spring-cloud-config-server:0.0.1-SNAPSHOT
docker tag trexhepaj/mmv-summary-service:0.0.1-SNAPSHOT trexhepaj/mmv-summary-service:0.0.1-SNAPSHOT
docker tag trexhepaj/mmv-usermanagementservice:0.0.1-SNAPSHOT trexhepaj/mmv-usermanagementservice:0.0.1-SNAPSHOT
docker tag trexhepaj/vite-react-frontend:latest trexhepaj/vite-react-frontend:latest

REM Login to Docker Hub
docker login

REM Push images
docker push trexhepaj/text-to-voice:latest
docker push trexhepaj/avatar-video-service:latest
docker push trexhepaj/mmv-naming-server:0.0.1-SNAPSHOT
docker push trexhepaj/mmv-document-handling-service:0.0.1-SNAPSHOT
docker push trexhepaj/mmv-api-gateway:0.0.1-SNAPSHOT
docker push trexhepaj/mmv-spring-cloud-config-server:0.0.1-SNAPSHOT
docker push trexhepaj/mmv-summary-service:0.0.1-SNAPSHOT
docker push trexhepaj/mmv-usermanagementservice:0.0.1-SNAPSHOT
docker push trexhepaj/vite-react-frontend:latest

echo All images have been pushed to Docker Hub



C:\Users\user\Desktop\deritash\AI-Reports\k8s>kubectl get services
NAME                         TYPE           CLUSTER-IP       EXTERNAL-IP       PORT(S)          AGE
api-gateway                  LoadBalancer   10.105.227.25    34.27.8.231       8765:32022/TCP   4m31s
avatar-video-service         LoadBalancer   10.105.238.1     199.223.232.229   8900:30400/TCP   4m22s
kubernetes                   ClusterIP      10.105.224.1     <none>            443/TCP          26h
naming-server                LoadBalancer   10.105.239.195   34.67.206.23      8761:31216/TCP   4m36s
postgres-db                  ClusterIP      10.105.233.73    <none>            5432/TCP         5m33s
react-frontend               LoadBalancer   10.105.233.144   34.71.41.214      80:30818/TCP     4m12s
spring-cloud-config-server   LoadBalancer   10.105.233.180   34.134.13.84      8888:30608/TCP   4m28s
summary-service              LoadBalancer   10.105.234.85    35.226.243.127    8100:32637/TCP   4m25s
text-to-voice-service        LoadBalancer   10.105.236.149   34.66.6.92        5000:32058/TCP   4m16s
usermanagementservice        LoadBalancer   10.105.233.227   34.66.211.86      8300:32609/TCP   4m19s

C:\Users\user\Desktop\deritash\AI-Reports\k8s>

pause
