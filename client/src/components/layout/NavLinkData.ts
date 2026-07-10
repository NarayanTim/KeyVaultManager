import { Key, FolderKanban, BookOpen} from 'lucide-react';



export const navItems = [
    { to: "/dashboard", icon: FolderKanban, label: "Dashboard" },
    { to: '/projects', icon: Key, label: 'Projects' },
    { to: '/documentation', icon: BookOpen, label: 'Documentation' },
]