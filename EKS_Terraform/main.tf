provider "aws" {
  region = "us-east-1"
}

resource "aws_vpc" "Github_actions_vpc" {
  cidr_block         = "10.0.0.0/16"
  enable_dns_hostnames = true  # Required for EKS
  enable_dns_support   = true  # Required for EKS
  tags = {
    Name = "Github-actions-vpc"
  }
}

resource "aws_subnet" "github-actions_subnet" {
  count              = 2
  vpc_id             = aws_vpc.Github_actions_vpc.id
  cidr_block         = cidrsubnet(aws_vpc.Github_actions_vpc.cidr_block, 8, count.index)
  availability_zone  = element(["us-east-1a", "us-east-1b"], count.index)  # Changed AZs
  map_public_ip_on_launch = true

  tags = {
    Name = "github-actions-subnet-${count.index}"
  }
}

resource "aws_internet_gateway" "github-actions_igw" {
  vpc_id = aws_vpc.Github_actions_vpc.id

  tags = {
    Name = "github-actions-igw"
  }
}

resource "aws_route_table" "github-actions_route_table" {
  vpc_id = aws_vpc.Github_actions_vpc.id

  route {
    cidr_block = "0.0.0.0/0"
    gateway_id = aws_internet_gateway.github-actions_igw.id
  }

  tags = {
    Name = "github-actions-route-table"
  }
}

resource "aws_route_table_association" "a" {
  count          = 2
  subnet_id      = aws_subnet.github-actions_subnet[count.index].id
  route_table_id = aws_route_table.github-actions_route_table.id
}

resource "aws_security_group" "github-actions_cluster_sg" {
  vpc_id = aws_vpc.Github_actions_vpc.id

  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }

  tags = {
    Name = "github-actions-cluster-sg"
  }
}

resource "aws_security_group" "github-actions_node_sg" {
  vpc_id = aws_vpc.Github_actions_vpc.id

  ingress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }

  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }

  tags = {
    Name = "github-actions-node-sg"
  }
}

resource "aws_eks_cluster" "github-actions" {
  name       = "fullstack-webapp-cluster"
  role_arn = aws_iam_role.github-actions_cluster_role.arn

  vpc_config {
    subnet_ids         = aws_subnet.github-actions_subnet[*].id
    security_group_ids = [aws_security_group.github-actions_cluster_sg.id]
  }

  depends_on = [
    aws_iam_role_policy_attachment.github-actions_cluster_role_policy,
  ]
}

resource "aws_eks_node_group" "github-actions" {
  cluster_name    = aws_eks_cluster.github-actions.name
  node_group_name = "fullstack-webapp-node-group"
  node_role_arn   = aws_iam_role.github-actions_node_group_role.arn
  subnet_ids      = aws_subnet.github-actions_subnet[*].id

  scaling_config {
    desired_size = 3 
    max_size     = 5
    min_size     = 2 
  }

  instance_types = ["t2.medium"]  
  remote_access {
    ec2_ssh_key          = var.ssh_key_name
    source_security_group_ids = [aws_security_group.github-actions_node_sg.id]
  }

  depends_on = [
    aws_iam_role_policy_attachment.github-actions_node_group_role_policy,
    aws_iam_role_policy_attachment.github-actions_node_group_cni_policy,
    aws_iam_role_policy_attachment.github-actions_node_group_registry_policy,
  ]
}

resource "aws_iam_role" "github-actions_cluster_role" {
  name = "github-actions-cluster-role"

  assume_role_policy = <<EOF
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Principal": {
        "Service": "eks.amazonaws.com"
      },
      "Action": "sts:AssumeRole"
    }
  ]
}
EOF
}

resource "aws_iam_role_policy_attachment" "github-actions_cluster_role_policy" {
  role     = aws_iam_role.github-actions_cluster_role.name
  policy_arn = "arn:aws:iam::aws:policy/AmazonEKSClusterPolicy"
}

resource "aws_iam_role" "github-actions_node_group_role" {
  name = "github-actions-node-group-role"

  assume_role_policy = <<EOF
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Principal": {
        "Service": "ec2.amazonaws.com"
      },
      "Action": "sts:AssumeRole"
    }
  ]
}
EOF
}

resource "aws_iam_role_policy_attachment" "github-actions_node_group_role_policy" {
  role     = aws_iam_role.github-actions_node_group_role.name
  policy_arn = "arn:aws:iam::aws:policy/AmazonEKSWorkerNodePolicy"
}

resource "aws_iam_role_policy_attachment" "github-actions_node_group_cni_policy" {
  role     = aws_iam_role.github-actions_node_group_role.name
  policy_arn = "arn:aws:iam::aws:policy/AmazonEKS_CNI_Policy"
}

resource "aws_iam_role_policy_attachment" "github-actions_node_group_registry_policy" {
  role     = aws_iam_role.github-actions_node_group_role.name
  policy_arn = "arn:aws:iam::aws:policy/AmazonEC2ContainerRegistryReadOnly"
}