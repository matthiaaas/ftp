import React, { Component, Fragment, createRef } from "react";
import styled from "styled-components";

import ContextMenuItem, { Separator } from "./ContextMenu";

const Wrapper = styled.ul`
  z-index: 10;
  position: fixed;
  padding: 12px 0;
  border-radius: 12px;
  font-family: "Karla";
  font-weight: 400;
  font-size: 16px;
  color: var(--color-grey);
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

class ContextMenuFolder extends Component {
  render() {
    return (
      <ContextMenu _ref={this.props._ref} {...this.props}>
        <ContextMenuItem shortcut="⌘I" disabled>Info</ContextMenuItem>
        <Separator />
        <ContextMenuItem shortcut="⇧⌘N">New Folder</ContextMenuItem>
        <ContextMenuItem shortcut="⇧⌘F" disabled>New File</ContextMenuItem>
        <Separator />
        <ContextMenuItem shortcut="⌘C" disabled>Copy</ContextMenuItem>
        <ContextMenuItem shortcut="⌘V" disabled>Paste</ContextMenuItem>
        <ContextMenuItem shortcut="⌘J" disabled>Duplicate</ContextMenuItem>
        <Separator />
        <ContextMenuItem shortcut="⌘D">Download</ContextMenuItem>
        <Separator />
        <ContextMenuItem shortcut="⌘⌫">Delete</ContextMenuItem>
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
        <ContextMenuItem shortcut="⇧⌘N">New Folder</ContextMenuItem>
        <ContextMenuItem shortcut="⇧⌘F" disabled>New File</ContextMenuItem>
        <Separator />
        <ContextMenuItem shortcut="⌘C" disabled>Copy</ContextMenuItem>
        <ContextMenuItem shortcut="⌘V" disabled>Paste</ContextMenuItem>
        <ContextMenuItem shortcut="⌘J" disabled>Duplicate</ContextMenuItem>
        <Separator />
        <ContextMenuItem shortcut="⌘D">Download</ContextMenuItem>
        <Separator />
        <ContextMenuItem shortcut="⌘⌫">Delete</ContextMenuItem>
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
      folder: true,
      file: true,
      space: true,

      disable: true
    }

    this.fileMenu = createRef();
    this.folderMenu = createRef();

    this.openForFile = this.openForFile.bind(this);
    this.openForFolder = this.openForFolder.bind(this);
    this.closeAll = this.closeAll.bind(this);
  }

  openForFile(event, file) {
    this.setState({ file: false, disable: false });

    let menu = this.fileMenu.current;
    menu.style.top = event.pageY - 200 + "px";
    menu.style.left = event.pageX + "px";

    if (event.pageY + 200 > window.innerHeight) {
      menu.style.top = window.innerHeight - 350 + "px";
    }
  }

  openForFolder(event, folder) {
    this.setState({ folder: false, disable: false });

    let menu = this.folderMenu.current;
    menu.style.top = event.pageY - 200 + "px";
    menu.style.left = event.pageX + "px";

    if (event.pageY + 200 > window.innerHeight) {
      menu.style.top = window.innerHeight - 350 + "px";
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
        <ContextMenuFolder _ref={this.folderMenu} hidden={this.state.folder} />
        <ContextMenuFile _ref={this.fileMenu} hidden={this.state.file} />
      </Fragment>
    )
  } 
}
