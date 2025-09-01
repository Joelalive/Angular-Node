import { Component, OnDestroy, OnInit } from '@angular/core';
import { Post } from '../post';
import { PostService } from '../post.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-post-list',
  standalone: false,
  templateUrl: './post-list.component.html',
  styleUrl: './post-list.component.css'
})
export class PostListComponent implements OnInit, OnDestroy {

posts: Post[] = [];
private postSubscription!: Subscription;
constructor(private postService: PostService) {}

ngOnInit() {
  this.posts = this.postService.getPosts();
  this.getPosts();
}

getPosts() {
    this.postSubscription = this.postService.updatedPosts.subscribe((posts: Post[]) => {      
    this.posts = posts;
  });
}

ngOnDestroy(): void {
    this.postSubscription.unsubscribe();
}

}
