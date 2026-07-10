import {Shield,Zap,Code,Server, Terminal, Lock} from 'lucide-react';


export const features = [
  {
    icon: Shield,
    title: 'Bank-Grade Security',
    description: '256-bit AES encryption at rest and in transit. Your secrets are always protected.',
  },
  {
    icon: Zap,
    title: 'Lightning Fast',
    description: 'Sub-millisecond API responses. No cold starts, no delays.',
  },
  {
    icon: Code,
    title: 'Developer First',
    description: 'Simple APIs, SDKs for every language, and comprehensive documentation.',
  },
  {
    icon: Server,
    title: 'Infrastructure Ready',
    description: 'Works with Vercel, Netlify, Docker, Kubernetes, and any CI/CD pipeline.',
  },
];



export const threeProcess = [
    {
    step: '1',
    title: 'Create a project',
    description: 'Set up your project and receive a unique Project API Key.',
    icon: Terminal,
},
{
step: '2',
title: 'Add variables',
description: 'Store your environment variables and API keys securely.',
icon: Lock,
},
{
step: '3',
title: 'Integrate',
description: 'Use our SDK or API to fetch variables in your application.',
icon: Code,
},
]





export const codeExample = `# Install the SDK
npm install @envkey/sdk

# Use in your app
import { EnvKey } from '@envkey/sdk';

const client = new EnvKey({
  apiKey: process.env.PROJECT_API_KEY,
});

// Get your environment variables
const dbUrl = await client.get('DATABASE_URL');
const apiKey = await client.get('API_SECRET');`;