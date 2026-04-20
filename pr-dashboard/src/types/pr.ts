export interface PRUser {
  login: string;
  avatar_url: string;
  type: string;
}

export interface PRLabel {
  id: number;
  name: string;
  color: string;
}

export interface PR {
  id: number;
  number: number;
  title: string;
  html_url: string;
  state: string;
  draft: boolean;
  created_at: string;
  updated_at: string;
  labels: PRLabel[];
  assignees: PRUser[];
  user: PRUser;
}

export interface AssigneeGroup {
  assignee: PRUser;
  prs: PR[];
}
