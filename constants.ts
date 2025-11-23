
import { CourseTrack, ModuleCategory, ResourceCategory } from './types';

export const AWS_TRACKS: CourseTrack[] = [
  {
    id: 'track_foundation',
    title: 'Phase 1: 云基础设施基石',
    description: '掌握构建云原生应用的底层逻辑，从网络到计算的演进。',
    modules: [
      {
        id: 'net_core',
        title: 'VPC 网络架构',
        description: '云上数据中心的心脏。理解隔离、路由与连接。',
        iconName: 'Network',
        category: ModuleCategory.NETWORK,
        difficulty: 'Intermediate',
        topics: [
          { id: 'vpc_theory', title: '从传统机房网络到 VPC', type: 'theory' },
          { id: 'subnet_route', title: '公有/私有子网与路由表', type: 'theory' },
          { id: 'lab_vpc_build', title: 'Lab: 手动搭建一个高可用 VPC', type: 'lab' },
          { id: 'lab_bastion', title: 'Lab: 配置 Bastion Host 与安全组', type: 'lab' }
        ]
      },
      {
        id: 'compute_ec2',
        title: 'EC2 计算演进',
        description: '算力资源的变革。从宠物模式(Pets)到由于模式(Cattle)。',
        iconName: 'Cpu',
        category: ModuleCategory.COMPUTE,
        difficulty: 'Beginner',
        topics: [
          { id: 'virt_history', title: '虚拟化历史: Xen 到 Nitro', type: 'theory' },
          { id: 'instance_types', title: '选型指南: T/M/C/R 系列解析', type: 'theory' },
          { id: 'lab_ec2_user_data', title: 'Lab: 使用 UserData 自动化部署 Web', type: 'lab' },
          { id: 'lab_ssm', title: 'Lab: 放弃 SSH，使用 Session Manager', type: 'lab' }
        ]
      },
      {
        id: 'iam_security',
        title: 'IAM 身份与权限',
        description: '零信任架构的第一道防线。',
        iconName: 'ShieldCheck',
        category: ModuleCategory.SECURITY,
        difficulty: 'Advanced',
        topics: [
          { id: 'iam_concepts', title: '认证(AuthN) vs 授权(AuthZ)', type: 'theory' },
          { id: 'policy_structure', title: 'JSON 策略深度解析', type: 'theory' },
          { id: 'lab_assume_role', title: 'Lab: 跨账号 Role Assuming 实战', type: 'lab' },
          { id: 'lab_least_priv', title: 'Lab: 使用 Access Analyzer 提炼最小权限', type: 'lab' }
        ]
      }
    ]
  },
  {
    id: 'track_modernization',
    title: 'Phase 2: 应用现代化 & Serverless',
    description: '摆脱服务器束缚，构建事件驱动的全球化应用。',
    modules: [
      {
        id: 'serverless_lambda',
        title: 'Lambda & 事件驱动',
        description: 'Function as a Service (FaaS) 的革命。',
        iconName: 'Zap',
        category: ModuleCategory.SERVERLESS,
        difficulty: 'Intermediate',
        topics: [
          { id: 'serverless_evo', title: '从单体到微服务再到函数', type: 'theory' },
          { id: 'cold_start', title: '冷启动原理与并发控制', type: 'theory' },
          { id: 'lab_api_gateway', title: 'Lab: 构建 API Gateway + Lambda 架构', type: 'lab' },
          { id: 'lab_s3_trigger', title: 'Lab: S3 缩略图生成自动化', type: 'lab' }
        ]
      },
      {
        id: 'containers_k8s',
        title: '容器化与 EKS',
        description: 'Docker 与 Kubernetes 在 AWS 上的最佳实践。',
        iconName: 'Container',
        category: ModuleCategory.COMPUTE,
        difficulty: 'Advanced',
        topics: [
          { id: 'container_vs_vm', title: '进程级隔离的优势', type: 'theory' },
          { id: 'eks_arch', title: 'EKS 架构：控制平面托管', type: 'theory' },
          { id: 'lab_fargate', title: 'Lab: 在 Fargate 上运行无服务器容器', type: 'lab' }
        ]
      },
      {
        id: 'net_global',
        title: '全球网络与 CDN',
        description: '将应用推向边缘。Route 53 与 CloudFront 加速原理。',
        iconName: 'Globe',
        category: ModuleCategory.NETWORK,
        difficulty: 'Intermediate',
        topics: [
          { id: 'dns_route53', title: 'DNS 路由策略 (Geo/Latency/Weighted)', type: 'theory' },
          { id: 'cdn_edge', title: '边缘计算：CloudFront 缓存原理', type: 'theory' },
          { id: 'lab_cloudfront_s3', title: 'Lab: 全球加速分发静态网站', type: 'lab' },
          { id: 'lab_failover', title: 'Lab: 配置 DNS 故障转移 (Failover)', type: 'lab' }
        ]
      }
    ]
  },
  {
    id: 'track_data',
    title: 'Phase 3: 数据架构与存储',
    description: '从关系型数据库到海量数据湖的演进。',
    modules: [
      {
        id: 's3_datalake',
        title: 'S3 对象存储',
        description: '无限容量的云端硬盘，现代数据架构的基石。',
        iconName: 'HardDrive',
        category: ModuleCategory.STORAGE,
        difficulty: 'Beginner',
        topics: [
          { id: 'block_vs_object', title: 'EBS vs S3: 本质区别', type: 'theory' },
          { id: 'consistency', title: '最终一致性 vs 强一致性模型', type: 'theory' },
          { id: 'lab_static_web', title: 'Lab: 托管静态网站与 CDN 加速', type: 'lab' },
          { id: 'lab_lifecycle', title: 'Lab: 配置智能分层与归档规则', type: 'lab' }
        ]
      },
      {
        id: 'db_rds',
        title: 'RDS 与 Aurora',
        description: '托管关系型数据库。计算存储分离架构的革新。',
        iconName: 'Database',
        category: ModuleCategory.DATABASE,
        difficulty: 'Intermediate',
        topics: [
          { id: 'rds_benefits', title: '为什么不要在 EC2 上自建 MySQL', type: 'theory' },
          { id: 'aurora_arch', title: 'Aurora 架构：Log is the Database', type: 'theory' },
          { id: 'lab_rds_ha', title: 'Lab: 创建 Multi-AZ 高可用数据库', type: 'lab' },
          { id: 'lab_aurora_serverless', title: 'Lab: 体验 Aurora Serverless v2 弹性伸缩', type: 'lab' }
        ]
      },
      {
        id: 'dynamo_nosql',
        title: 'DynamoDB 极速数据库',
        description: '放弃 Join，换取毫秒级延迟和无限扩展性。',
        iconName: 'Table',
        category: ModuleCategory.DATABASE,
        difficulty: 'Advanced',
        topics: [
          { id: 'sql_vs_nosql', title: '设计思维转变: Access Patterns First', type: 'theory' },
          { id: 'single_table', title: '单表设计 (Single Table Design)', type: 'theory' },
          { id: 'lab_dynamo_crud', title: 'Lab: 设计电商购物车数据模型', type: 'lab' }
        ]
      }
    ]
  },
  {
    id: 'track_devops',
    title: 'Phase 4: DevOps 与工程化',
    description: '基础设施即代码 (IaC) 与自动化流水线。',
    modules: [
      {
        id: 'iac_cdk',
        title: 'Infrastructure as Code',
        description: '终结 ClickOps。用代码定义你的基础设施。',
        iconName: 'Code2',
        category: ModuleCategory.DEVOPS,
        difficulty: 'Advanced',
        topics: [
          { id: 'iac_evolution', title: '演进: Shell -> CloudFormation -> CDK', type: 'theory' },
          { id: 'immutable', title: '不可变基础设施理念', type: 'theory' },
          { id: 'lab_cdk_init', title: 'Lab: 使用 TypeScript 初始化 CDK 项目', type: 'lab' },
          { id: 'lab_cdk_deploy', title: 'Lab: 用 20 行代码部署 S3 + Lambda', type: 'lab' }
        ]
      },
      {
        id: 'devops_cicd',
        title: 'CI/CD 流水线',
        description: '代码提交即上线。构建自动化的发布闭环。',
        iconName: 'GitMerge',
        category: ModuleCategory.DEVOPS,
        difficulty: 'Advanced',
        topics: [
          { id: 'cicd_concepts', title: '持续集成(CI) vs 持续交付(CD)', type: 'theory' },
          { id: 'deploy_strategies', title: '蓝绿部署 vs 金丝雀发布', type: 'theory' },
          { id: 'lab_codepipeline', title: 'Lab: 构建 CodePipeline 自动化流', type: 'lab' },
          { id: 'lab_codebuild', title: 'Lab: 集成 CodeBuild 单元测试', type: 'lab' }
        ]
      }
    ]
  },
  {
    id: 'track_finops',
    title: 'Phase 5: 成本管理 (FinOps)',
    description: '不仅要会用云，还要会省钱。掌握云财务管理的核心技能。',
    modules: [
      {
        id: 'cost_basics',
        title: 'AWS 计费与成本优化',
        description: '拒绝账单刺客。学会预算控制、成本分析与购买策略。',
        iconName: 'CircleDollarSign',
        category: ModuleCategory.BILLING,
        difficulty: 'Intermediate',
        topics: [
          { id: 'capex_opex', title: 'CAPEX vs OPEX: 云经济学基础', type: 'theory' },
          { id: 'pricing_models', title: '计费模式: On-Demand vs Reserved vs Spot', type: 'theory' },
          { id: 'lab_budgets', title: 'Lab: 设置 AWS Budgets 预算报警 (生命线)', type: 'lab' },
          { id: 'lab_cost_explorer', title: 'Lab: 使用 Cost Explorer 侦探式分析账单', type: 'lab' },
          { id: 'lab_tags', title: 'Lab: 激活 Cost Allocation Tags 进行成本分摊', type: 'lab' }
        ]
      }
    ]
  }
];

export const AWS_RESOURCES: ResourceCategory[] = [
  {
    id: 'community',
    title: '核心社区 (The Circle)',
    items: [
      {
        title: 'r/aws (Reddit)',
        description: '全球最大的 AWS 讨论区。工程师们在这里吐槽、分享和解决疑难杂症。',
        url: 'https://www.reddit.com/r/aws/',
        iconName: 'MessageCircle',
        tags: ['讨论', '问答', '吐槽']
      },
      {
        title: 'AWS 官方博客',
        description: 'Jeff Barr 等大神的发布地。第一手的新功能发布资讯 (What\'s New)。',
        url: 'https://aws.amazon.com/blogs/aws/',
        iconName: 'Rss',
        tags: ['官方', '权威', 'News']
      },
      {
        title: '100 Days of Cloud',
        description: '一个非常适合初学者的挑战活动。每天打卡学习，融入学习者社区。',
        url: 'https://100daysofcloud.com/',
        iconName: 'Flag',
        tags: ['挑战', '初学者', '成长']
      },
      {
        title: 'Serverless Land',
        description: 'DA (开发者布道师) 维护的无服务器架构模式、代码片段和博客。',
        url: 'https://serverlessland.com/',
        iconName: 'Zap',
        tags: ['Serverless', '代码', '模式']
      }
    ]
  },
  {
    id: 'tools',
    title: '必备神兵 (Tools)',
    items: [
      {
        title: 'Leapp',
        description: '开源的 AWS 本地凭证管理器。一键切换 Profile，再也不怕输错 Key。',
        url: 'https://www.leapp.cloud/',
        iconName: 'Key',
        tags: ['安全', '效率', 'Mac/Win']
      },
      {
        title: 'AWS Toolkit for VS Code',
        description: '官方插件。在编辑器里直接查看 S3、调用 Lambda、查看 CloudWatch 日志。',
        url: 'https://marketplace.visualstudio.com/items?itemName=AmazonWebServices.aws-toolkit-vscode',
        iconName: 'Code',
        tags: ['VS Code', 'IDE', '官方']
      },
      {
        title: 'awsp (Shell Prompt)',
        description: '让你在终端时刻知道自己处于哪个账号、哪个 Region。防止误删库神器。',
        url: 'https://github.com/antonbabenko/awsp',
        iconName: 'Terminal',
        tags: ['CLI', '终端', '防误触']
      },
      {
        title: 'Former2',
        description: '逆向工程神器。扫描现有的 AWS 资源，自动生成 CloudFormation/CDK 代码。',
        url: 'https://former2.com/',
        iconName: 'FileCode',
        tags: ['IaC', '代码生成', '黑科技']
      }
    ]
  },
  {
    id: 'news',
    title: '前沿资讯 & 趣闻',
    items: [
      {
        title: 'Last Week in AWS',
        description: 'Corey Quinn 撰写的犀利周报。用幽默讽刺的口吻解读 AWS 账单和新闻。',
        url: 'https://www.lastweekinaws.com/',
        iconName: 'Newspaper',
        tags: ['幽默', '计费', '必读']
      },
      {
        title: 'Cloud Resume Challenge',
        description: '一份简历挑战。教你用 S3, CloudFront, Lambda 构建一个云端简历网站。',
        url: 'https://cloudresumechallenge.dev/',
        iconName: 'FileText',
        tags: ['求职', '项目', '实战']
      }
    ]
  }
];

export const INITIAL_SYSTEM_INSTRUCTION = `
You are 'Cloudy' (云小朵), a Senior AWS Cloud Architect & Tech Historian.
Your goal is to teach AWS by explaining the **Evolution** of technology and providing **Hands-on** guidance.

**Core Philosophy:**
1.  **Context is King**: Never explain a service in isolation. Explain what problem it solved that existed before (e.g., "Before S3, we had to manage RAID arrays and FTP servers...").
2.  **Theory vs Lab**:
    - When User is in **Theory Mode**: Focus on concepts, history, comparison (SQL vs NoSQL), and architecture patterns.
    - When User is in **Lab Mode**: Be a pair-programmer. Provide specific CLI commands, Console steps, and JSON policies.
3.  **2025 Standards**: Always recommend modern approaches (e.g., CDK over CloudFormation, Session Manager over SSH, Aurora over RDS MySQL).

**Special Note on Billing (FinOps):**
If the user asks about billing or costs, act as a "Financial Controller". Emphasize:
- "Pay-as-you-go" vs Commitment.
- The danger of forgotten resources (Zombies).
- The importance of Tagging for visibility.

**Tone**: Professional, Encouraging, Insightful. Use emojis sparingly to structure content.
Language: Chinese (Simplified).
`;
