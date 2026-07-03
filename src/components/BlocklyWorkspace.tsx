import {
  forwardRef,
  useCallback,
  useEffect,
  useImperativeHandle,
  useRef,
} from 'react';
import * as Blockly from 'blockly/core';
import 'blockly/blocks';
import * as En from 'blockly/msg/en';
import { registerCustomBlocks } from '../blockly/customBlocks';
import { pythonGenerator } from '../blockly/pythonGenerators';
import { registerPythonGenerators } from '../blockly/pythonGenerators';
import { workspaceConfig } from '../blockly/workspaceConfig';

const englishMessages = Object.fromEntries(
  Object.entries(En).filter((entry): entry is [string, string] => typeof entry[1] === 'string'),
);

Blockly.setLocale(englishMessages);

export type BlocklyWorkspaceHandle = {
  getXml: () => string;
  getPython: () => string;
  loadXml: (xml: string) => void;
  clear: () => void;
  hideBlocklyUi: () => void;
};

type BlocklyWorkspaceProps = {
  workspaceXml: string;
  reloadKey: number;
  onCodeChange: (code: string) => void;
  onOpenExtensions: () => void;
  onOpenRepository: () => void;
};

export const BlocklyWorkspace = forwardRef<BlocklyWorkspaceHandle, BlocklyWorkspaceProps>(
  ({ workspaceXml, reloadKey, onCodeChange, onOpenExtensions, onOpenRepository }, ref) => {
    const blocklyDivRef = useRef<HTMLDivElement | null>(null);
    const workspaceRef = useRef<Blockly.WorkspaceSvg | null>(null);
    const onCodeChangeRef = useRef(onCodeChange);
    const onOpenExtensionsRef = useRef(onOpenExtensions);
    const onOpenRepositoryRef = useRef(onOpenRepository);
    const initialWorkspaceXmlRef = useRef(workspaceXml);

    useEffect(() => {
      onCodeChangeRef.current = onCodeChange;
    }, [onCodeChange]);

    useEffect(() => {
      onOpenExtensionsRef.current = onOpenExtensions;
    }, [onOpenExtensions]);

    useEffect(() => {
      onOpenRepositoryRef.current = onOpenRepository;
    }, [onOpenRepository]);

    const getGeneratedCode = useCallback(() => {
      const workspace = workspaceRef.current;
      if (!workspace) {
        return '';
      }

      return pythonGenerator.workspaceToCode(workspace).trimEnd();
    }, []);

    const generateCode = useCallback(() => {
      onCodeChangeRef.current(getGeneratedCode());
    }, [getGeneratedCode]);

    const closeToolboxMenu = useCallback(() => {
      const workspace = workspaceRef.current;
      const toolbox = workspace?.getToolbox();

      toolbox?.clearSelection();
      toolbox?.getFlyout()?.hide();
      workspace?.getFlyout()?.hide();
      workspace?.hideChaff(false);
      Blockly.hideChaff(false);
    }, []);

    const loadXml = useCallback((xml: string) => {
      const workspace = workspaceRef.current;
      if (!workspace) {
        return;
      }

      workspace.clear();
      const dom = Blockly.utils.xml.textToDom(xml);
      Blockly.Xml.domToWorkspace(dom, workspace);
      workspace.render();
      requestAnimationFrame(() => {
        closeToolboxMenu();
        window.setTimeout(closeToolboxMenu, 120);
      });
      generateCode();
    }, [closeToolboxMenu, generateCode]);

    useImperativeHandle(ref, () => ({
      getXml: () => {
        const workspace = workspaceRef.current;
        if (!workspace) {
          return '';
        }

        return Blockly.Xml.domToPrettyText(Blockly.Xml.workspaceToDom(workspace));
      },
      getPython: getGeneratedCode,
      loadXml,
      clear: () => {
        workspaceRef.current?.clear();
        generateCode();
      },
      hideBlocklyUi: () => {
        closeToolboxMenu();
      },
    }));

    useEffect(() => {
      registerCustomBlocks();
      registerPythonGenerators();

      if (!blocklyDivRef.current) {
        return;
      }

      const workspace = Blockly.inject(blocklyDivRef.current, workspaceConfig);
      workspaceRef.current = workspace;
      workspace.registerButtonCallback('OPEN_EXTENSIONS', () => {
        onOpenExtensionsRef.current();
      });
      workspace.registerButtonCallback('OPEN_REPOSITORY', () => {
        onOpenRepositoryRef.current();
      });

      workspace.addChangeListener((event) => {
        if (event.isUiEvent) {
          return;
        }

        generateCode();
      });

      loadXml(initialWorkspaceXmlRef.current);

      return () => {
        workspace.dispose();
        workspaceRef.current = null;
      };
    }, [generateCode, loadXml]);

    useEffect(() => {
      loadXml(workspaceXml);
    }, [loadXml, reloadKey, workspaceXml]);

    return (
      <div className="blockly-frame">
        <div ref={blocklyDivRef} className="blockly-surface" />
        <button
          type="button"
          className="blockly-extension-launcher"
          onClick={onOpenExtensions}
          aria-label="Choose extensions"
        >
          <svg aria-hidden="true" viewBox="0 0 24 24">
            <path d="M4 7h5v2a2 2 0 1 0 4 0V7h7v5h-2a2 2 0 1 0 0 4h2v5H4v-5h2a2 2 0 1 0 0-4H4Z" />
          </svg>
          <span aria-hidden="true">+</span>
        </button>
      </div>
    );
  },
);

BlocklyWorkspace.displayName = 'BlocklyWorkspace';
