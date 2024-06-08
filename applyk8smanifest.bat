@echo off

REM Change directory to the k8s folder
cd "C:\Users\user\Desktop\deritash\AI-Reports\k8s"

REM Apply Kubernetes Manifests
kubectl apply -f pv-pvc.yaml

kubectl apply -f naming-server-deployment.yaml
kubectl apply -f document-handling-service-deployment.yaml
kubectl apply -f api-gateway-deployment.yaml
kubectl apply -f spring-cloud-config-server-deployment.yaml
kubectl apply -f summary-service-deployment.yaml
kubectl apply -f avatar-video-service-deployment.yaml
kubectl apply -f usermanagementservice-deployment.yaml
kubectl apply -f postgres-db-deployment.yaml
kubectl apply -f text-to-voice-service-deployment.yaml
kubectl apply -f react-frontend-deployment.yaml


