import { Component, OnDestroy, OnInit } from '@angular/core';
import { Post } from '../post';
import { PostService } from '../post.service';
import { Subscription } from 'rxjs';
import { Router } from '@angular/router';

@Component({
  selector: 'app-post-list',
  standalone: false,
  templateUrl: './post-list.component.html',
  styleUrl: './post-list.component.css'
})
export class PostListComponent implements OnInit, OnDestroy {

isloading = false;
posts: Post[] = [];
private postSubscription!: Subscription;
constructor(private postService: PostService, private router: Router) {}

ngOnInit() {
  this.isloading = true;
  this.postService.getPosts();
  this.getPosts();
}

getPosts() {
    this.postSubscription = this.postService.updatedPosts.subscribe((posts: Post[]) => {  
      this.isloading = false;    
    this.posts = posts;
  });
}

onDelete(postId: string) {
    this.postService.deletePost(postId);
}

editPost(postId: string) {
    console.log('Editing post with id: ', postId);
    // Navigate to the edit page
    this.router.navigate(['/edit', postId]);
}

ngOnDestroy(): void {
    this.postSubscription.unsubscribe();
}

}
