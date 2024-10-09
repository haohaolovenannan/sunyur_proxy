export interface IProxy {
  domainList: Array<string>;
  proxyRules: Array<{
    rule: string;
    target: string;
  }>;
  hearderList: Array<{
    name: string;
    value: string;
    desc?: string;
  }>;
}

export interface IEnv {
  id: string;
  projectId: string;
  name: string;
  setting: IProxy;
}

// eslint-disable-next-line import/export
export function getProjectList(): Promise<Array<{ name: string; id: string }>> {
  return window.API.project.getList();
}

export function addProject(name: string) {
  return window.API.project.addData({
    name,
  });
}
// eslint-disable-next-line import/export

export function createProject(data: any) {
  return window.API.project.getProjectList();
}

export function deleteProjectById(projectId: string) {
  return window.API.project.deleteById(projectId);
}

export function getEnvList(): Promise<Array<IEnv>> {
  return window.API.env.getList();
}

export function deleteEnvById(id: string) {
  return window.API.env.deleteById(id);
}

export function deleteEnvByProjectId(projectId: string) {
  return window.API.env.deleteAllByProjectId(projectId);
}

export function addEnv(projectId: string, name: string) {
  return window.API.env.addData({
    projectId,
    name,
    setting: {
      domainList: [],
      proxyRules: [],
      hearderList: [
        {
          name: 'Cookie',
          value: '',
        },
        {
          name: 'User-Defined',
          value: '',
        },
      ],
    } as IProxy,
  });
}

export function updateEnvById(
  id: string,
  data: IEnv
): Promise<
  Array<{ projectId: string; name: string; id: string; setting: IProxy }>
> {
  return window.API.env.updateById(id, JSON.stringify(data));
}
