import React from "react";
import PropTypes from "prop-types";
import { withStyles } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import Switch from "@material-ui/core/Switch";
import FolderIcon from "@material-ui/icons/Folder";
import FolderOpenIcon from "@material-ui/icons/FolderOpen";
import SettingsIcon from "@material-ui/icons/SettingsRounded";
import DescriptionIcon from "@material-ui/icons/Description";
import InsertDriveFileIcon from "@material-ui/icons/InsertDriveFile";
import AddIcon from "@material-ui/icons/Add";
import DeleteIcon from "@material-ui/icons/Delete";
import Tree, { getTreeLeafDataByIndexArray } from "material-ui-tree";

const superagent = { get: (url: any) => fetch(url).then(res => res.json()) };

class TreeDemo extends React.Component<{ classes: any }, { data: any }> {
  static propTypes = {
    classes: PropTypes.object.isRequired
  };

  state = {
    data: {
      path: "material-ui-tree",
      type: "tree",
      sha: "b3d36479a033ed6296c34fdf689d5cdbcf7a0136",
      url:
        "https://api.github.com/repos/shallinta/material-ui-tree/git/trees/b3d36479a033ed6296c34fdf689d5cdbcf7a0136"
    }
  };

  requestTreeLeafChildrenData = (
    leafData: any,
    chdIndex: any,
    doExpand: any
  ) => {
    const { url, type } = leafData;
    if (type === "tree") {
      superagent.get(url).then(({ body: res }) => {
        if (res && res.tree) {
          const data = { ...this.state.data };
          getTreeLeafDataByIndexArray(data, chdIndex, "tree").tree = res.tree;
          this.setState({ data }, () => {
            doExpand();
          });
        } else {
          doExpand();
        }
      });
    } else {
      doExpand();
    }
  };

  renderTreeLeafLabel = (leafData: any, expand: any) => {
    const { classes } = this.props;
    const { path, type } = leafData;
    if (type === "tree") {
      if (expand) {
        return (
          <Typography className={classes.leaf}>
            <FolderOpenIcon className={classes.icon} />
            {path}
          </Typography>
        );
      }
      return (
        <Typography className={classes.leaf}>
          <FolderIcon className={classes.icon} />
          {path}
        </Typography>
      );
    }
    if (type === "blob") {
      if (path.startsWith(".") || path.includes("config")) {
        return (
          <Typography className={classes.leaf}>
            <SettingsIcon className={classes.icon} />
            {path}
          </Typography>
        );
      }
      if (path.endsWith(".js")) {
        return (
          <Typography className={classes.leaf}>
            <DescriptionIcon className={classes.icon} />
            {path}
          </Typography>
        );
      }
      return (
        <Typography className={classes.leaf}>
          <InsertDriveFileIcon className={classes.icon} />
          {path}
        </Typography>
      );
    }
  };

  getTreeLeafActionsData = (leafData: any, chdIndex: any, expand: any) => {
    const { classes } = this.props;
    const { type } = leafData;
    if (type === "tree") {
      if (!expand) {
        return null;
      }
      return [
        {
          icon: <AddIcon className={classes.icon} />,
          label: "new",
          hint: "Insert file",
          onClick: () => {
            const data = { ...this.state.data };
            const leaf = getTreeLeafDataByIndexArray(data, chdIndex, "tree");
            if (
              !Reflect.has(leaf, "tree") ||
              !Reflect.has(leaf.tree, "length")
            ) {
              leaf.tree = [];
            }
            leaf.tree.push({
              path: "new file",
              type: "blob",
              sha: Math.random()
            });
            this.setState({ data });
          }
        }
      ];
    }
    return [
      {
        icon: <DeleteIcon color="secondary" className={classes.icon} />,
        hint: "Delete file",
        onClick: () => {
          const data = { ...this.state.data };
          const parent = getTreeLeafDataByIndexArray(
            data,
            chdIndex.slice(0, chdIndex.length - 1),
            "tree"
          );
          const lastIndex = chdIndex[chdIndex.length - 1];
          parent.tree.splice(lastIndex, 1);
          this.setState({ data });
        }
      }
    ];
  };

  render() {
    const { classes } = this.props;
    return (
      <Tree
        className={classes.container}
        title="material-ui-tree"
        data={this.state.data}
        labelName="path"
        valueName="sha"
        childrenName="tree"
        renderLabel={this.renderTreeLeafLabel}
        getActionsData={this.getTreeLeafActionsData}
        requestChildrenData={this.requestTreeLeafChildrenData}
      />
    );
  }
}

const styles = () => ({
  container: {
    margin: 20
  },
  icon: {
    fontSize: 20
  },
  leaf: {
    display: "flex",
    alignItems: "center"
  }
});

export default withStyles(styles, { withTheme: true })(TreeDemo);
