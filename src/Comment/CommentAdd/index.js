import React, { Component } from "react";
import { Mutation } from "react-apollo";
import gql from "graphql-tag";
import TextArea from "../../TextArea";
import Button from "../../Button";
import ErrorMessage from "../../Error";
// import ISSUE_FRAGMENT from "../fragments";

class CommentAdd extends Component {
  state = {
    value: "",
    issueId: this.props,
  };

  // On keyboard press update value
  onChange = (value) => {
    this.setState({ value });
  };

  // On submit, add value to state
  onSubmit = (event, addComment) => {
    addComment().then(() => this.setState({ value: "" }));
    event.preventDefault();
  };

  // ToDO Complete Optimistic UI
  // updateAddComment = (
  //   client,
  //   {
  //     data: {
  //       addComment: {
  //         commentEdge: {
  //           node: {
  //             body: { value },
  //           },
  //         },
  //       },
  //     },
  //   }
  // ) => {
  //   // Get current cached values
  //   const issue = client.readFragment({
  //     id: `Issue:${this.state.issueId}`,
  //     fragment: ISSUE_FRAGMENT,
  //   });

  //   // Update cache with current value
  //   client.writeFragment({
  //     id: `Issue:${this.state.issueId}`,
  //     fragment: ISSUE_FRAGMENT,
  //     data: {
  //       ...issue,
  //       comments: {
  //         ...issue.comments,
  //       },
  //       edges: {
  //         ...issue.comments.edges,
  //         node: {
  //           body: value,
  //         },
  //       },
  //     },
  //   });
  // };

  render() {
    const { issueId } = this.props;
    const { value } = this.state;
    const ADD_COMMENT = gql`
      mutation($subjectId: ID!, $body: String!) {
        addComment(input: { subjectId: $subjectId, body: $body }) {
          commentEdge {
            node {
              body
            }
          }
        }
      }
    `;

    return (
      <Mutation
        mutation={ADD_COMMENT}
        variables={{ body: value, subjectId: issueId }}
        // TODO Complete optimistic UI
        // optimisticResponse={{
        //   addComment: {
        //     __typename: "Mutation",
        //     commentEdge: {
        //       __typename: "Comment",
        //       node: {
        //         __typename: "Body",
        //         body: value,
        //       },
        //     },
        //   },
        // }}
        // update={this.updateAddComment}
      >
        {(addComment, { data, loading, error }) => (
          <div>
            {error && <ErrorMessage error={error} />}

            <form onSubmit={(event) => this.onSubmit(event, addComment)}>
              <TextArea
                value={value}
                onChange={(event) => this.onChange(event.target.value)}
                placeholder="Leave a comment"
              />
              <Button type="submit">Comment</Button>
            </form>
          </div>
        )}
      </Mutation>
    );
  }
}

export default CommentAdd;
