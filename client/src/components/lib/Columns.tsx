import { Badge, Button } from "@/components/ui";
import type { Project } from "@/@types/project.t";
import type { NavigateFunction } from "react-router-dom";

interface ColumnProps {
  navigate: NavigateFunction;
  setSelectedProject: React.Dispatch<React.SetStateAction<Project | null>>;
  setDeleteModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
  onUpdateProjectState: (project:Project) => void;
}

const getColumns = ({navigate, setSelectedProject, setDeleteModalOpen, onUpdateProjectState}: ColumnProps) => [
  {
    key: "name",
    header: "Name",
  },
  {
    key: "status",
    header: "Status",
    render: (item: Project) => (
      <Badge variant={item.isActive ? "success" : "error"}>
        {item.isActive ? "Active" : "Inactive"}
      </Badge>
    ),
  },
  {
    key: "createdAt",
    header: "Created",
    render: (item: Project) => (
      <span className="text-secondary-500 dark:text-secondary-400">
        {item.createdAt
          ? new Date(item.createdAt).toLocaleDateString()
          : "-"}
      </span>
    ),
  },
  {
    key: "actions",
    header: "Actions",
    render: (item: Project) => (
      <div className="flex items-center gap-2">
        <Button
          variant="ghost"
          size="sm"
          onClick={(e) => {
            e.stopPropagation();
            navigate(`/project/${item.id}`);
          }}
        >
          View
        </Button>

        <Button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onUpdateProjectState?.(item)
          }}
          className={`
            relative inline-flex h-6 w-11 items-center rounded-full transition-colors
            ${item.isActive
              ? "bg-green-500"
              : "bg-secondary-300 dark:bg-secondary-700"}
          `}
        >
          <span
            className={`
              inline-block h-4 w-4 transform rounded-full bg-white transition-transform
              ${item.isActive ? "translate-x-6" : "translate-x-1"}
            `}
          />
        </Button>



        <Button
          variant="ghost"
          size="sm"
          className="text-red-500 hover:bg-red-50 dark:hover:bg-red-950"
          onClick={(e) => {
            e.stopPropagation();
            setSelectedProject(item);
            setDeleteModalOpen(true);
          }}
        >
          Delete
        </Button>
      </div>
    ),
  },
];

export default getColumns
