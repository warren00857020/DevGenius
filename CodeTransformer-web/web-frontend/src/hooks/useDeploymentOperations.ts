// hooks/useDeploymentOperations.ts
import { deploymentFiles, deployGKE, generateUnitTest } from '../testApiService';
import { b64EncodeUnicode } from '../utils/b64EncodeUnicode';
import { useFileStore } from '../store/useFileStore';
import { useProcessStore } from '../store/useProcessStore';

export function useDeploymentOperations() {
  // ✅ 從 Store 取得需要的資料和方法
  const files = useFileStore((state) => state.files);
  const setFiles = useFileStore((state) => state.setFiles);

  const setIsTesting = useProcessStore((state) => state.setIsTesting);
  const addTestProgress = useProcessStore((state) => state.addTestProgress);
  const setTestProgress = useProcessStore((state) => state.setTestProgress);
  const setTestResult = useProcessStore((state) => state.setTestResult);
  const addFileLog = useProcessStore((state) => state.addFileLog);

  // 產生部署檔案（Dockerfile & YAML）並自動部署
  const handleGenerateConfigs = async () => {
    if (!files || files.length === 0) return;

    for (const file of files) {
      try {
        const fileNamePart = file.fileName.split('/').pop() || 'unknown.txt';
        const result = await deploymentFiles(fileNamePart, file.newCode);

        // 部署 GKE
        const base64YamlContent = b64EncodeUnicode(result.yaml || '');
        const base64DockerfileContent = b64EncodeUnicode(result.dockerfile || '');
        const base64NewCode = b64EncodeUnicode(file.newCode || '');

        const singlePayload = JSON.stringify({
          code_files: [{ filename: fileNamePart, content: base64NewCode }],
          job_yaml: base64YamlContent,
          dockerfile: base64DockerfileContent,
        });

        const deployResult = await deployGKE(singlePayload);

        // ✅ 使用 addFileLog 新增 log
        if (deployResult.status === "success" && deployResult.kubectl_logs) {
          const logContent = "=== KUBECTL LOGS ===\n" + atob(deployResult.kubectl_logs) + "\n\n";
          addFileLog(file.fileName, logContent);
        }
      } catch (error) {
        console.error("產生部署檔案失敗 for file:", file.fileName, error);
      }
    }
  };

  // 產生 UnitTest、Dockerfile、YAML，並送至 GKE 測試
  const handleTestProject = async () => {
    setIsTesting(true);
    setTestProgress(["開始測試專案…"]);
    setTestResult("專案在 GKE 測試中…");

    const newFiles = [...files];

    for (let i = 0; i < newFiles.length; i++) {
      const file = newFiles[i];

      try {
        const unitTestResult = await generateUnitTest(file.fileName.split('/').pop() || '', file.newCode);
        file.unitTestCode = unitTestResult.unit_test;
        // ✅ 使用 addTestProgress 新增進度訊息
        addTestProgress(`UnitTest 產生完成: ${file.fileName}`);

        const originalName = file.fileName.split('/').pop() || '';
        const newName = originalName.replace('.java', 'Test.java');
        const deployResult = await deploymentFiles(newName, file.unitTestCode || "");
        file.dockerfileContent = deployResult.dockerfile;
        file.yamlContent = deployResult.yaml;
        // ✅ 使用 addTestProgress 新增進度訊息
        addTestProgress(`部署檔案產生完成: ${file.fileName}`);

      } catch (error) {
        console.error(`產生測試或部署檔案失敗: ${file.fileName}`, error);
        continue;
      }
    }

    setFiles(newFiles);
    addTestProgress("GKE 部署測試完成");
    setTestResult("所有檔案測試完成");
    setIsTesting(false);
  };

  return {
    handleGenerateConfigs,
    handleTestProject,
  };
}
