``` bash
az aks create -g fibcalculator -n fibcluster --no-ssh-key
```

### Create secret

enter the command below to create the secret

```
kubectl create secret generic pgpassword --from-literal PGPASSWORD=12345ASDf
```

move to the proper folder

```
cd complex_k8s/k8s
```

Create ingress controller

```bash
# https://kubernetes.github.io/ingress-nginx/deploy/#azure
kubectl apply -f https://raw.githubusercontent.com/kubernetes/ingress-nginx/controller-v1.0.3/deploy/static/provider/cloud/deploy.yaml
```

```
docker build -t mosabami/multi-server:v2 .
```

```
docker image push mosabami/multi-server:v2
```

```
REDIS_KEY=I6IY6innfZF46Koi+vaspuHAJiBIC2fq54tmCiOXmI8
```

