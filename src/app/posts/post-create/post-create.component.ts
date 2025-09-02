import { Component, inject, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { PostService } from '../post.service';
import {
  MatSnackBar,
  MatSnackBarHorizontalPosition,
  MatSnackBarVerticalPosition,
} from '@angular/material/snack-bar';
import { Post } from '../post';
import { ActivatedRoute } from '@angular/router';
import { map } from 'rxjs';

@Component({
  selector: 'app-post-create',
  standalone: false,
  templateUrl: './post-create.component.html',
  styleUrl: './post-create.component.css'
})
export class PostCreateComponent implements OnInit {
  private _snackBar = inject(MatSnackBar);

  horizontalPosition: MatSnackBarHorizontalPosition = 'right';
  verticalPosition: MatSnackBarVerticalPosition = 'bottom';
  mode: 'create' | 'edit' = 'create';
  post: any;
  isloading = false;

  constructor(private postService: PostService, private route: ActivatedRoute) { }


  ngOnInit(): void {
    this.postCreateListener();
    this.getPostId();
  }

  getPostId() {
    this.route.paramMap.subscribe((paramMap) => {
      if (paramMap.has('postId')) {
        const postId = paramMap.get('postId');
        this.getPost(postId!);
        this.mode = 'edit';
      } else {
        this.mode = 'create';
      }
    });
  }

  getPost(postId: string) {
    this.isloading = true;
    this.postService.getPost(postId).pipe(
      map((post: any) => {
        return { id: post._id, title: post.title, content: post.content };
      } )
    ).subscribe((post: Post) => {   
      this.isloading = false;   
      this.post = post;
    });
  }

  postCreateListener() {
    this.postService.newPostListener$.subscribe((newPost: {action: string, post: Post}) => {
      if (newPost.action === 'add') {
        this.openSnackBar('Post added successfully!');
      } else if (newPost.action === 'update') {
        this.openSnackBar('Post updated successfully!');
      }
    });
  }

  savePost(form: NgForm) {
    this.isloading = true;
    if (this.mode === 'edit') {
      this.postService.updatePost({
        id: this.post.id,
        title: form.value.title,
        content: form.value.content
      });
    } else {
      this.postService.addPost(form.value.title, form.value.content);
    }
    form.resetForm();
  }

  openSnackBar(content: string = 'Post added successfully!') {
    this._snackBar.open(content, 'Dismiss', {
      horizontalPosition: this.horizontalPosition,
      verticalPosition: this.verticalPosition,
    });
  }

}
