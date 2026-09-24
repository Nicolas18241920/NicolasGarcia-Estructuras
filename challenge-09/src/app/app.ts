import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TreeNode, MenuItem } from './nary-tree.model';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App implements OnInit {
  menuTree!: TreeNode;
  selectedItem: MenuItem | null = null;

  ngOnInit(): void {
    this.buildMenuTree();
  }

  buildMenuTree(): void {
    const rootItem: MenuItem = { title: 'Root', link: '/' };
    this.menuTree = new TreeNode(rootItem);

    const profileNode = new TreeNode({ title: 'Profile', link: '/profile', component: 'ProfileComponent' });
    const messagesNode = new TreeNode({ title: 'Messages', link: '/messages', component: 'MessagesComponent' });

    const settingsNode = new TreeNode(
      { title: 'Settings', link: '/settings', component: 'SettingsComponent' },
      [
        new TreeNode({ title: 'Account', link: '/settings/account', component: 'AccountComponent' }),
        new TreeNode({ title: 'Profile', link: '/settings/profile', component: 'SettingsProfileComponent' }),
        new TreeNode({ title: 'Security & Privacy', link: '/settings/security', component: 'SecurityPrivacyComponent' }),
        new TreeNode({ title: 'Password', link: '/settings/password', component: 'PasswordComponent' }),
        new TreeNode({ title: 'Notification', link: '/settings/notification', component: 'NotificationComponent' })
      ],
      true
    );

    const helpNode = new TreeNode(
      { title: 'Help', link: '/help', component: 'HelpComponent' },
      [
        new TreeNode({ title: "FAQ's", link: '/help/faqs', component: 'FaqsComponent' }),
        new TreeNode({ title: 'Submit a Ticket', link: '/help/ticket', component: 'SubmitTicketComponent' }),
        new TreeNode({ title: 'Network Status', link: '/help/network', component: 'NetworkStatusComponent' })
      ],
      true
    );

    const logoutNode = new TreeNode({ title: 'Logout', link: '/logout', component: 'LogoutComponent' });

    this.menuTree.addChild(profileNode);
    this.menuTree.addChild(messagesNode);
    this.menuTree.addChild(settingsNode);
    this.menuTree.addChild(helpNode);
    this.menuTree.addChild(logoutNode);

    this.selectedItem = settingsNode.children[2].item;
  }

  toggleNode(node: TreeNode, event: Event): void {
    event.stopPropagation();
    if (!node.isLeaf()) {
      node.expanded = !node.expanded;
    }
  }

  selectItem(node: TreeNode, event: Event): void {
    event.stopPropagation();
    this.selectedItem = node.item;
  }
}