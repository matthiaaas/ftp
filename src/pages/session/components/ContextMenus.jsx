import React, { Component, Fragment, createRef } from "react";
import styled from "styled-components";

import ContextMenuItem, { Separator } from "./ContextMenu";

const Wrapper = styled.ul`
  z-index: 10;
  position: fixed;
  padding: 12px 0;
  border-radius: 4px;
  font-family: var(--font-main);
  font-weight: 400;
  font-size: 16px;
  color: var(--color-grey);
  border: 1px solid var(--color-dark-light);
  background: var(--color-black);

  display: ${props => props.hidden ? "none" : "unset"};
`

class ContextMenu extends Component {
  render() {
    return (
      <Wrapper ref={this.props._ref} {...this.props}>
        {this.props.children}
      </Wrapper>
    )
  }
}

class ContextMenuSpace extends Component {
  render() {
    return (
      <ContextMenu _ref={this.props._ref} {...this.props}>
        <ContextMenuItem
          name="New Folder"
          shortcut="⇧⌘N"
          onExecute={() => {
            this.props.onReturn.call(this);
            this.props.onNewFolder.call(this);
          }}
        />
        <ContextMenuItem shortcut="⇧⌘F" disabled>New File</ContextMenuItem>
      </ContextMenu>
    )
  }
}

class ContextMenuFolder extends Component {
  render() {
    return (
      <ContextMenu _ref={this.props._ref} {...this.props}>
        <ContextMenuItem shortcut="⌘I" disabled>Info</ContextMenuItem>
        <Separator />
        <ContextMenuItem
          name="New Folder"
          shortcut="⇧⌘N"
          onExecute={() => {
            this.props.onReturn.call(this);
            this.props.onNewFolder.call(this);
          }}
        />
        <ContextMenuItem shortcut="⇧⌘F" disabled>New File</ContextMenuItem>
        <Separator />
        <ContextMenuItem shortcut="⌘C" disabled>Copy</ContextMenuItem>
        <ContextMenuItem shortcut="⌘V" disabled>Paste</ContextMenuItem>
        <ContextMenuItem shortcut="⌘J" disabled>Duplicate</ContextMenuItem>
        <Separator />
        <ContextMenuItem shortcut="⌘D" disabled>Download</ContextMenuItem>
        <Separator />
        <ContextMenuItem
          name="Delete"
          shortcut="⌘⌫"
          onExecute={() => {
            this.props.ftp.deleteExternFolderRecursively(this.props.target.path + this.props.target.name, this.props.onReload);
            this.props.onReturn.call(this);
          }}
        />
      </ContextMenu>
    )
  }
}

class ContextMenuFile extends Component {
  render() {
    return (
      <ContextMenu _ref={this.props._ref} {...this.props}>
        <ContextMenuItem shortcut="⌘I" disabled>Info</ContextMenuItem>
        <Separator />
        <ContextMenuItem shortcut="⌘O" disabled>Open</ContextMenuItem>
        <Separator />
        <ContextMenuItem
          name="New Folder"
          shortcut="⇧⌘N"
          onExecute={() => {
            this.props.onReturn.call(this);
            this.props.onNewFolder.call(this);
          }}
        />
        <ContextMenuItem shortcut="⇧⌘F" disabled>New File</ContextMenuItem>
        <Separator />
        <ContextMenuItem shortcut="⌘C" disabled>Copy</ContextMenuItem>
        <ContextMenuItem shortcut="⌘V" disabled>Paste</ContextMenuItem>
        <ContextMenuItem shortcut="⌘J" disabled>Duplicate</ContextMenuItem>
        <Separator />
        <ContextMenuItem
          name="Download"
          shortcut="⌘D"
          onExecute={() => {
            this.props.ftp.downloadExternFile(this.props.target.path, this.props.target.name);
            this.props.onReturn.call(this);
          }}
        />
        <Separator />
        <ContextMenuItem
          name="Delete"
          shortcut="⌘⌫"
          onExecute={() => {
            this.props.ftp.deleteExternFile(this.props.target.path + this.props.target.name);
            this.props.onReturn.call(this);
            this.props.onReload.call(this);
          }}
        />
      </ContextMenu>
    )
  }
}

const Disable = styled.div`
  z-index: 9;
  width: 100vw;
  height: 100vh;
  position: fixed;
  background: rgba(20, 20, 23, 0);

  display: ${props => props.hidden ? `none` : "unset"};
`

export default class ContextMenus extends Component {
  constructor(props) {
    super(props);

    this.state = {
      target: null,

      folder: true,
      file: true,
      space: true,

      disable: true
    }

    this.fileMenu = createRef();
    this.folderMenu = createRef();
    this.spaceMenu = createRef();

    this.openForFile = this.openForFile.bind(this);
    this.openForFolder = this.openForFolder.bind(this);
    this.openForSpace = this.openForSpace.bind(this);
    
    this.closeAll = this.closeAll.bind(this);
  }

  openForFile(event, file) {
    this.setState({ file: false, disable: false, target: file });

    let menu = this.fileMenu.current;
    menu.style.top = event.pageY - 280 + "px";
    menu.style.left = event.pageX + 5 + "px";

    if (event.pageY + 200 > window.innerHeight) {
      menu.style.top = window.innerHeight - 400 + "px";
    }
  }

  openForFolder(event, folder) {
    this.setState({ folder: false, disable: false, target: folder });

    let menu = this.folderMenu.current;
    menu.style.top = event.pageY - 280 + "px";
    menu.style.left = event.pageX + 5 + "px";

    if (event.pageY + 200 > window.innerHeight) {
      menu.style.top = window.innerHeight - 400 + "px";
    }
  }

  openForSpace(event, path) {
    this.setState({ space: false, disable: false, target: path });

    let menu = this.spaceMenu.current;
    menu.style.top = event.pageY - 80 + "px";
    menu.style.left = event.pageX + 5 + "px";

    if (event.pageY + 50 > window.innerHeight) {
      menu.style.top = window.innerHeight - 100 + "px";
    }
  }

  closeAll() {
    this.setState({
      folder: true,
      file: true,
      space: true,
      disable: true
    });
  }

  render() {
    return (
      <Fragment>
        {this.props.children}
        <Disable hidden={this.state.disable} onClick={this.closeAll} />
        <ContextMenuFolder
          _ref={this.folderMenu}
          ftp={this.props.ftp}
          target={this.state.target}
          onReturn={() => {
            this.closeAll();
          }}
          onReload={() => {
            this.props.onReload.call(this);
          }}
          onNewFolder={this.props.onNewFolder}
          hidden={this.state.folder}
        />
        <ContextMenuFile
          _ref={this.fileMenu}
          ftp={this.props.ftp}
          target={this.state.target}
          onReturn={() => {
            this.closeAll();
          }}
          onReload={() => {
            this.props.onReload.call(this);
          }}
          onNewFolder={this.props.onNewFolder}
          hidden={this.state.file}
        />
        <ContextMenuSpace
          _ref={this.spaceMenu}
          ftp={this.props.ftp}
          target={this.state.target}
          onReturn={() => {
            this.closeAll();
          }}
          onReload={() => {
            this.props.onReload.call(this);
          }}
          onNewFolder={this.props.onNewFolder}
          hidden={this.state.space}
        />
      </Fragment>
    )
  } 
}
