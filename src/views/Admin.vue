<template>
  <div class="admin-container" :class="{ 'dark-mode': profile.theme?.isDark }" :style="themeStyle">
    <nav class="admin-nav">
      <div class="nav-brand">
        <h1>{{ currentLang === 'zh' ? '后台管理' : 'Admin Panel' }}</h1>
      </div>
      <div class="nav-controls">
        <router-link to="/" target="_blank">
          <i class="fas fa-external-link-alt"></i>
          <span>{{ currentLang === 'zh' ? '查看网站' : 'View Site' }}</span>
        </router-link>
        <!-- 语言切换 -->
        <div class="language-switch">
          <button 
            @click="switchLang('zh')" 
            :class="{ active: currentLang === 'zh' }"
          >中</button>
          <button 
            @click="switchLang('en')" 
            :class="{ active: currentLang === 'en' }"
          >EN</button>
        </div>
        <!-- 主题切换 -->
        <div class="theme-switch">
          <button @click="toggleTheme">
            <i :class="profile.theme?.isDark ? 'fas fa-sun' : 'fas fa-moon'"></i>
          </button>
        </div>
        <button class="btn-logout" @click="handleLogout">
          <i class="fas fa-sign-out-alt"></i>
          <span>{{ currentLang === 'zh' ? '退出' : 'Logout' }}</span>
        </button>
      </div>
    </nav>

    <div class="admin-content">
      <div class="admin-card">
        <h2>{{ currentLang === 'zh' ? '基本信息' : 'Basic Info' }}</h2>
        <form @submit.prevent="saveBasicInfo" class="form-section">
          <div class="form-group">
            <label>{{ currentLang === 'zh' ? '名字' : 'Name' }}</label>
            <input type="text" v-model="profile.name">
          </div>
          <div class="form-group">
            <label>{{ currentLang === 'zh' ? '职位' : 'Title' }}</label>
            <input type="text" v-model="profile.title">
          </div>
          <div class="form-group">
            <label>{{ currentLang === 'zh' ? '头像' : 'Avatar' }}</label>
            <div class="avatar-upload">
              <img :src="profile.avatar" :alt="profile.name" class="avatar-preview">
              <input 
                type="file" 
                ref="fileInput"
                @change="handleFileChange" 
                accept="image/*"
                style="display: none"
              >
              <button type="button" @click="$refs.fileInput.click()" class="btn-upload">
                {{ currentLang === 'zh' ? '选择图片' : 'Choose Image' }}
              </button>
            </div>
          </div>
          <div class="form-group">
            <label>{{ currentLang === 'zh' ? '关于我' : 'About Me' }}</label>
            <textarea v-model="profile.about" rows="4"></textarea>
          </div>
          <button type="submit">
            {{ currentLang === 'zh' ? '保存基本信息' : 'Save Basic Info' }}
          </button>
        </form>
      </div>

      <div class="admin-card">
        <h2>{{ currentLang === 'zh' ? '技能管理' : 'Skills' }}</h2>
        <div class="skills-section">
          <div class="skills-list">
            <div v-for="(skill, index) in profile.skills" :key="index" class="skill-item">
              <span>{{ skill }}</span>
              <button @click="removeSkill(index)" class="btn-remove">×</button>
            </div>
          </div>
          <div class="add-skill">
            <input 
              type="text" 
              v-model="newSkill" 
              :placeholder="currentLang === 'zh' ? '添加新技能' : 'Add new skill'"
            >
            <button @click="addSkill">
              {{ currentLang === 'zh' ? '添加' : 'Add' }}
            </button>
          </div>
        </div>
      </div>

      <div class="admin-card">
        <h2>{{ currentLang === 'zh' ? '项目管理' : 'Projects' }}</h2>
        <div class="projects-section">
          <div v-for="project in profile.projects" :key="project.id" class="project-item">
            <div class="project-info">
              <h3>{{ project.title }}</h3>
              <p>{{ project.description }}</p>
            </div>
            <div class="project-actions">
              <button @click="editProject(project)" class="btn-edit">
                {{ currentLang === 'zh' ? '编辑' : 'Edit' }}
              </button>
              <button @click="deleteProject(project.id)" class="btn-delete">
                {{ currentLang === 'zh' ? '删除' : 'Delete' }}
              </button>
            </div>
          </div>
          <button @click="showProjectModal = true" class="btn-add">
            {{ currentLang === 'zh' ? '添加项目' : 'Add Project' }}
          </button>
        </div>
      </div>

      <div class="admin-card">
        <h2>{{ currentLang === 'zh' ? '社交链接' : 'Social Links' }}</h2>
        <form @submit.prevent="saveSocialLinks" class="form-section">
          <div class="form-group">
            <label>GitHub</label>
            <input type="url" v-model="profile.social.github">
          </div>
          <div class="form-group">
            <label>Email</label>
            <input type="email" v-model="profile.social.email">
          </div>
          <div class="form-group">
            <label>LinkedIn</label>
            <input type="url" v-model="profile.social.linkedin">
          </div>
          <button type="submit">
            {{ currentLang === 'zh' ? '保存社交链接' : 'Save Social Links' }}
          </button>
        </form>
      </div>

      <div class="admin-card">
        <h2>{{ currentLang === 'zh' ? '主题设置' : 'Theme Settings' }}</h2>
        <form @submit.prevent="saveTheme" class="form-section">
          <div class="form-group">
            <label>{{ currentLang === 'zh' ? '主题模式' : 'Theme Mode' }}</label>
            <div class="theme-mode-switch">
              <button 
                type="button"
                :class="{ active: !profile.theme.isDark }"
                @click="setThemeMode(false)"
              >
                <i class="fas fa-sun"></i>
                {{ currentLang === 'zh' ? '浅色' : 'Light' }}
              </button>
              <button 
                type="button"
                :class="{ active: profile.theme.isDark }"
                @click="setThemeMode(true)"
              >
                <i class="fas fa-moon"></i>
                {{ currentLang === 'zh' ? '深色' : 'Dark' }}
              </button>
            </div>
          </div>
          <div class="form-group">
            <label>{{ currentLang === 'zh' ? '颜色设置' : 'Color Settings' }}</label>
            <div class="color-settings">
              <div class="color-item">
                <label>{{ currentLang === 'zh' ? '主色调' : 'Primary Color' }}</label>
                <div class="color-picker">
                  <input type="color" v-model="profile.theme.primaryColor">
                  <span>{{ profile.theme.primaryColor }}</span>
                </div>
              </div>
              <div class="color-item">
                <label>{{ currentLang === 'zh' ? '文字颜色' : 'Text Color' }}</label>
                <div class="color-picker">
                  <input type="color" v-model="profile.theme.textColor">
                  <span>{{ profile.theme.textColor }}</span>
                </div>
              </div>
              <div class="color-item">
                <label>{{ currentLang === 'zh' ? '按钮颜色' : 'Button Color' }}</label>
                <div class="color-picker">
                  <input type="color" v-model="profile.theme.buttonColor">
                  <span>{{ profile.theme.buttonColor }}</span>
                </div>
              </div>
            </div>
          </div>
          <div class="form-group">
            <label>{{ currentLang === 'zh' ? '背景图片' : 'Background Image' }}</label>
            <div class="bg-upload">
              <div class="bg-preview" :style="bgPreviewStyle">
                <img v-if="profile.theme.backgroundImage" :src="profile.theme.backgroundImage" alt="背景预览">
              </div>
              <input 
                type="file" 
                ref="bgInput"
                @change="handleBgChange" 
                accept="image/*"
                style="display: none"
              >
              <div class="bg-actions">
                <button type="button" @click="$refs.bgInput.click()" class="btn-upload">
                  {{ currentLang === 'zh' ? '选择图片' : 'Choose Image' }}
                </button>
                <button 
                  v-if="profile.theme.backgroundImage" 
                  type="button" 
                  @click="removeBg" 
                  class="btn-remove"
                >
                  {{ currentLang === 'zh' ? '移除背景' : 'Remove' }}
                </button>
              </div>
            </div>
          </div>
          <div class="form-group">
            <label>{{ currentLang === 'zh' ? '字体' : 'Font Family' }}</label>
            <select v-model="profile.theme.fontFamily">
              <option value="'Helvetica Neue', Arial">Helvetica</option>
              <option value="'Times New Roman', serif">Times New Roman</option>
              <option value="Georgia, serif">Georgia</option>
              <option value="'Courier New', monospace">Courier New</option>
            </select>
          </div>
          <button type="submit">
            {{ currentLang === 'zh' ? '保存主题设置' : 'Save Theme' }}
          </button>
        </form>
      </div>
    </div>

    <!-- 项目编辑弹窗 -->
    <div v-if="showProjectModal" class="modal">
      <div class="modal-content">
        <h2>
          {{ editingProject 
            ? (currentLang === 'zh' ? '编辑项目' : 'Edit Project')
            : (currentLang === 'zh' ? '添加项目' : 'Add Project')
          }}
        </h2>
        <form @submit.prevent="saveProject">
          <div class="form-group">
            <label>{{ currentLang === 'zh' ? '项目名称' : 'Project Name' }}</label>
            <input type="text" v-model="currentProject.title" required>
          </div>
          <div class="form-group">
            <label>{{ currentLang === 'zh' ? '项目描述' : 'Description' }}</label>
            <textarea v-model="currentProject.description" rows="3" required></textarea>
          </div>
          <div class="form-group">
            <label>{{ currentLang === 'zh' ? '项目链接' : 'Project Link' }}</label>
            <input type="url" v-model="currentProject.link">
          </div>
          <div class="modal-actions">
            <button type="button" @click="showProjectModal = false">
              {{ currentLang === 'zh' ? '取消' : 'Cancel' }}
            </button>
            <button type="submit">
              {{ currentLang === 'zh' ? '保存' : 'Save' }}
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Admin',
  data() {
    return {
      profile: {
        name: '',
        title: '',
        avatar: '',
        about: '',
        skills: [],
        projects: [],
        social: {
          github: '',
          email: '',
          linkedin: ''
        },
        theme: {
          primaryColor: '#3498db',
          textColor: '#2c3e50',
          backgroundImage: '',
          fontFamily: "'Helvetica Neue', Arial",
          isDark: false
        }
      },
      currentLang: 'zh',
      newSkill: '',
      showProjectModal: false,
      editingProject: null,
      currentProject: {
        id: null,
        title: '',
        description: '',
        link: ''
      }
    }
  },
  computed: {
    bgPreviewStyle() {
      return {
        backgroundImage: this.profile.theme.backgroundImage ? 
          `url(${this.profile.theme.backgroundImage})` : 
          'none'
      }
    },
    themeStyle() {
      return {
        '--primary-color': this.profile.theme?.primaryColor || '#3498db',
        '--text-color': this.profile.theme?.textColor || '#2c3e50',
        '--button-color': this.profile.theme?.buttonColor || '#3498db',
        '--background-color': this.profile.theme?.isDark ? '#1a1a1a' : '#f5f6fa',
        '--card-background': this.profile.theme?.isDark ? '#2d2d2d' : '#ffffff',
        'background-image': this.profile.theme?.backgroundImage ? 
          `url(${this.profile.theme.backgroundImage})` : 'none',
        'background-size': 'cover',
        'background-position': 'center',
        'background-attachment': 'fixed',
        'font-family': this.profile.theme?.fontFamily || "'Helvetica Neue', Arial"
      }
    }
  },
  methods: {
    async loadProfile() {
      try {
        const response = await fetch(`http://localhost:3000/api/profile?lang=${this.currentLang}`);
        const data = await response.json();
        this.profile = data;
      } catch (error) {
        console.error('Error loading profile:', error);
      }
    },
    async handleFileChange(event) {
      const file = event.target.files[0];
      if (!file) return;

      const formData = new FormData();
      formData.append('avatar', file);

      try {
        const response = await fetch('http://localhost:3000/api/upload', {
          method: 'POST',
          body: formData
        });
        const data = await response.json();
        if (data.url) {
          this.profile.avatar = data.url;
          await this.saveBasicInfo();
        }
      } catch (error) {
        console.error('Upload error:', error);
        alert('上传失败，请重试');
      }
    },
    async saveBasicInfo() {
      try {
        const response = await fetch(`http://localhost:3000/api/profile?lang=${this.currentLang}`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(this.profile)
        });
        const data = await response.json();
        if (data.success) {
          alert('保存成功');
          await this.loadProfile();
        }
      } catch (error) {
        console.error('Error saving profile:', error);
        alert('保存失败');
      }
    },
    switchLang(lang) {
      this.currentLang = lang;
      this.loadProfile();
    },
    async handleBgChange(event) {
      const file = event.target.files[0];
      if (!file) return;

      const formData = new FormData();
      formData.append('background', file);

      try {
        const response = await fetch('http://localhost:3000/api/upload-bg', {
          method: 'POST',
          body: formData
        });
        const data = await response.json();
        if (data.url) {
          this.profile.theme.backgroundImage = data.url;
          await this.saveTheme();
        }
      } catch (error) {
        console.error('Upload error:', error);
        alert(this.currentLang === 'zh' ? '上传失败，请重试' : 'Upload failed');
      }
    },
    removeBg() {
      this.profile.theme.backgroundImage = '';
      this.saveTheme();
    },
    async saveTheme() {
      try {
        const response = await fetch(`http://localhost:3000/api/profile?lang=${this.currentLang}`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(this.profile)
        });
        const data = await response.json();
        if (data.success) {
          alert(this.currentLang === 'zh' ? '主题保存成功' : 'Theme saved');
          await this.loadProfile();
        }
      } catch (error) {
        console.error('Error saving theme:', error);
        alert(this.currentLang === 'zh' ? '保存失败' : 'Save failed');
      }
    },
    getRGB(hex) {
      const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
      return result ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16)
      } : { r: 0, g: 0, b: 0 };
    },
    setThemeMode(isDark) {
      this.profile.theme.isDark = isDark;
      if (isDark) {
        this.profile.theme.textColor = '#ffffff';
        document.body.classList.add('dark-mode');
      } else {
        this.profile.theme.textColor = '#2c3e50';
        document.body.classList.remove('dark-mode');
      }
      this.saveTheme();
    },
    async toggleTheme() {
      this.profile.theme.isDark = !this.profile.theme.isDark;
      // 更新服务器数据
      try {
        await fetch(`http://localhost:3000/api/profile?lang=${this.currentLang}`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(this.profile)
        });
      } catch (error) {
        console.error('Error saving theme:', error);
      }
    },
    addSkill() {
      if (this.newSkill.trim()) {
        if (!this.profile.skills) {
          this.profile.skills = [];
        }
        this.profile.skills.push(this.newSkill.trim());
        this.newSkill = '';
        this.saveBasicInfo();
      }
    },
    removeSkill(index) {
      this.profile.skills.splice(index, 1);
      this.saveBasicInfo();
    },
    editProject(project) {
      this.editingProject = project;
      this.currentProject = { ...project };
      this.showProjectModal = true;
    },
    async deleteProject(projectId) {
      if (confirm(this.currentLang === 'zh' ? '确定要删除这个项目吗？' : 'Are you sure to delete this project?')) {
        this.profile.projects = this.profile.projects.filter(p => p.id !== projectId);
        await this.saveBasicInfo();
      }
    },
    async saveProject() {
      if (this.editingProject) {
        // 更新现有项目
        const index = this.profile.projects.findIndex(p => p.id === this.editingProject.id);
        if (index !== -1) {
          this.profile.projects[index] = { ...this.currentProject };
        }
      } else {
        // 添加新项目
        const newProject = {
          ...this.currentProject,
          id: Date.now() // 简单的ID生成
        };
        if (!this.profile.projects) {
          this.profile.projects = [];
        }
        this.profile.projects.push(newProject);
      }

      await this.saveBasicInfo();
      this.closeProjectModal();
    },
    closeProjectModal() {
      this.showProjectModal = false;
      this.editingProject = null;
      this.currentProject = {
        id: null,
        title: '',
        description: '',
        link: ''
      };
    },
    async saveSocialLinks() {
      try {
        await this.saveBasicInfo();
        alert(this.currentLang === 'zh' ? '保存成功' : 'Saved successfully');
      } catch (error) {
        console.error('Error saving social links:', error);
        alert(this.currentLang === 'zh' ? '保存失败' : 'Save failed');
      }
    },
    handleLogout() {
      if (confirm(this.currentLang === 'zh' ? '确定要退出吗？' : 'Are you sure to logout?')) {
        localStorage.removeItem('token');
        this.$router.push('/login');
      }
    }
  },
  async created() {
    const urlParams = new URLSearchParams(window.location.search);
    this.currentLang = urlParams.get('lang') || localStorage.getItem('lang') || 'zh';
    await this.loadProfile();
    // 初始化时设置主题
    if (this.profile.theme?.isDark) {
      document.body.classList.add('dark-mode');
    } else {
      document.body.classList.remove('dark-mode');
    }
  }
}
</script>

<style lang="scss" scoped>
.admin-container {
  min-height: 100vh;
  background-color: var(--background-color);
  color: var(--text-color);

  .admin-nav {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    z-index: 1000;
    background: var(--card-background);
    padding: 1rem 2rem;
    display: flex;
    justify-content: space-between;
    align-items: center;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);

    h1 {
      margin: 0;
      font-size: 1.5rem;
      color: var(--text-color);
    }
  }

  .admin-content {
    padding-top: 80px; // 为固定导航栏留出空间
    padding: 100px 2rem 2rem;
  }

  .nav-controls {
    display: flex;
    align-items: center;
    gap: 1rem;

    a, button {
      height: 36px;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 0 1rem;
      border-radius: 6px;
      transition: all 0.3s ease;
      white-space: nowrap;
    }

    .language-switch {
      display: flex;
      gap: 0.5rem;

      button {
        width: 36px;
        padding: 0;
        border: 2px solid var(--button-color);
        background: transparent;
        color: var(--text-color);
        font-size: 0.9rem;

        &:hover, &.active {
          background: var(--button-color);
          color: white;
        }
      }
    }

    .theme-switch {
      button {
        width: 36px;
        padding: 0;
        border: 2px solid var(--button-color);
        background: transparent;
        color: var(--text-color);

        i {
          font-size: 1.2rem;
        }

        &:hover {
          background: var(--button-color);
          color: white;
        }
      }
    }

    .btn-logout {
      background: #e74c3c;
      color: white;
      border: none;

      &:hover {
        background: #c0392b;
        transform: translateY(-2px);
      }
    }
  }

  .admin-card {
    background: var(--card-background);
    color: var(--text-color);
  }

  // 特定按钮样式
  .btn-logout {
    background-color: #e74c3c !important;
    
    &:hover {
      filter: brightness(90%);
    }
  }

  .btn-delete {
    background-color: #e74c3c !important;
  }

  .btn-edit {
    background-color: #f39c12 !important;
  }

  .btn-add {
    background-color: #2ecc71 !important;
  }

  // 主题切换按钮样式
  .theme-switch button,
  .language-switch button {
    background-color: transparent !important;
    color: var(--text-color);
    border: 2px solid var(--button-color);

    &:hover {
      background-color: var(--button-color) !important;
      color: white;
    }

    &.active {
      background-color: var(--button-color) !important;
      color: white;
    }
  }
}

// 暗黑模式样式
.dark-mode {
  .admin-nav {
    background: var(--card-background);
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
  }

  .nav-controls {
    a {
      border-color: var(--text-color);
      
      &:hover {
        background: var(--text-color);
        color: var(--background-color);
      }
    }
  }
}

// 响应式布局
@media (max-width: 768px) {
  .admin-nav {
    padding: 0.5rem;
    
    h1 {
      font-size: 1.2rem;
    }
  }

  .nav-controls {
    gap: 0.5rem;

    a {
      font-size: 0.9rem;
      padding: 0 0.8rem;
    }

    .language-switch button,
    .theme-switch button {
      width: 32px;
      height: 32px;
    }

    .btn-logout {
      padding: 0 0.8rem;
      font-size: 0.9rem;
    }
  }

  .admin-content {
    padding: 80px 1rem 1rem;
  }
}

// 超小屏幕适配
@media (max-width: 480px) {
  .nav-controls {
    a span {
      display: none; // 隐藏文字，只显示图标
    }
  }
}

.admin-content {
  max-width: 1200px;
  margin: 2rem auto;
  padding: 0 2rem;
  display: grid;
  gap: 2rem;
}

.admin-card {
  background: white;
  padding: 2rem;
  border-radius: 12px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.05);

  h2 {
    color: #2c3e50;
    margin-bottom: 1.5rem;
    position: relative;
    
    &::after {
      content: '';
      position: absolute;
      bottom: -0.5rem;
      left: 0;
      width: 50px;
      height: 3px;
      background: #3498db;
      border-radius: 3px;
    }
  }
}

.form-section {
  .form-group {
    margin-bottom: 1.5rem;

    label {
      display: block;
      margin-bottom: 0.5rem;
      color: #2c3e50;
      font-weight: 500;
    }

    input, textarea {
      width: 100%;
      padding: 0.8rem;
      border: 2px solid #eee;
      border-radius: 8px;
      font-size: 1rem;
      transition: border-color 0.3s ease;

      &:focus {
        outline: none;
        border-color: #3498db;
      }
    }
  }

  button {
    padding: 0.8rem 1.5rem;
    background: #3498db;
    color: white;
    border: none;
    border-radius: 8px;
    cursor: pointer;
    transition: all 0.3s ease;

    &:hover {
      background: #2980b9;
      transform: translateY(-2px);
    }
  }
}

.skills-section {
  .skills-list {
    display: flex;
    flex-wrap: wrap;
    gap: 1rem;
    margin-bottom: 1.5rem;
  }

  .skill-item {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    background: #f8f9fa;
    padding: 0.5rem 1rem;
    border-radius: 20px;
    transition: all 0.3s ease;

    &:hover {
      transform: translateY(-2px);
      box-shadow: 0 4px 8px rgba(0,0,0,0.1);
    }

    .btn-remove {
      background: none;
      border: none;
      color: #e74c3c;
      cursor: pointer;
      font-size: 1.2rem;
      padding: 0;
      line-height: 1;
      opacity: 0;
      transition: all 0.3s ease;
    }

    &:hover .btn-remove {
      opacity: 1;
    }
  }

  .add-skill {
    display: flex;
    gap: 1rem;

    input {
      flex: 1;
      padding: 0.8rem;
      border: 2px solid #eee;
      border-radius: 8px;
      transition: all 0.3s ease;
      
      &:focus {
        outline: none;
        border-color: #3498db;
        box-shadow: 0 0 0 3px rgba(52, 152, 219, 0.1);
      }
    }

    button {
      padding: 0.8rem 1.5rem;
      background: #2ecc71;
      color: white;
      border: none;
      border-radius: 8px;
      cursor: pointer;
      transition: all 0.3s ease;

      &:hover {
        background: #27ae60;
        transform: translateY(-2px);
        box-shadow: 0 4px 8px rgba(46, 204, 113, 0.2);
      }
    }
  }
}

.projects-section {
  .project-item {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 1rem;
    border: 1px solid #eee;
    border-radius: 8px;
    margin-bottom: 1rem;

    .project-info {
      h3 {
        color: #2c3e50;
        margin-bottom: 0.5rem;
      }

      p {
        color: #666;
        font-size: 0.9rem;
      }
    }

    .project-actions {
      display: flex;
      gap: 0.5rem;

      button {
        padding: 0.5rem 1rem;
        border: none;
        border-radius: 6px;
        cursor: pointer;
        transition: all 0.3s ease;

        &.btn-edit {
          background: #f1c40f;
          color: #2c3e50;

          &:hover {
            background: #f39c12;
          }
        }

        &.btn-delete {
          background: #e74c3c;
          color: white;

          &:hover {
            background: #c0392b;
          }
        }
      }
    }
  }

  .btn-add {
    width: 100%;
    padding: 1rem;
    background: #2ecc71;
    color: white;
    border: none;
    border-radius: 8px;
    cursor: pointer;
    transition: all 0.3s ease;

    &:hover {
      background: #27ae60;
      transform: translateY(-2px);
    }
  }
}

.modal {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 1rem;
  z-index: 1000;

  .modal-content {
    background: white;
    padding: 2rem;
    border-radius: 12px;
    width: 100%;
    max-width: 500px;
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);

    h2 {
      margin-bottom: 1.5rem;
      color: #2c3e50;
      
      &::after {
        content: '';
        display: block;
        width: 50px;
        height: 3px;
        background: #3498db;
        margin-top: 0.5rem;
        border-radius: 3px;
      }
    }

    .form-group {
      margin-bottom: 1.5rem;

      label {
        display: block;
        margin-bottom: 0.5rem;
        color: #2c3e50;
        font-weight: 500;
      }

      input, textarea {
        width: 100%;
        padding: 0.8rem;
        border: 2px solid #eee;
        border-radius: 8px;
        font-size: 1rem;
        transition: all 0.3s ease;

        &:focus {
          outline: none;
          border-color: #3498db;
          box-shadow: 0 0 0 3px rgba(52, 152, 219, 0.1);
        }
      }
    }

    .modal-actions {
      display: flex;
      justify-content: flex-end;
      gap: 1rem;
      margin-top: 2rem;

      button {
        padding: 0.8rem 1.5rem;
        border: none;
        border-radius: 8px;
        cursor: pointer;
        transition: all 0.3s ease;
        font-weight: 500;

        &[type="button"] {
          background: #95a5a6;
          color: white;

          &:hover {
            background: #7f8c8d;
            transform: translateY(-2px);
            box-shadow: 0 4px 8px rgba(149, 165, 166, 0.3);
          }
        }

        &[type="submit"] {
          background: #3498db;
          color: white;

          &:hover {
            background: #2980b9;
            transform: translateY(-2px);
            box-shadow: 0 4px 8px rgba(52, 152, 219, 0.3);
          }
        }
      }
    }
  }
}

.avatar-upload {
  display: flex;
  align-items: center;
  gap: 1rem;

  .avatar-preview {
    width: 100px;
    height: 100px;
    border-radius: 50%;
    object-fit: cover;
    border: 2px solid #eee;
  }

  .btn-upload {
    padding: 0.5rem 1rem;
    background: #3498db;
    color: white;
    border: none;
    border-radius: 6px;
    cursor: pointer;
    transition: all 0.3s ease;

    &:hover {
      background: #2980b9;
      transform: translateY(-2px);
    }
  }
}

.color-picker {
  display: flex;
  align-items: center;
  gap: 1rem;

  input[type="color"] {
    width: 50px;
    height: 50px;
    padding: 0;
    border: none;
    border-radius: 8px;
    cursor: pointer;

    &::-webkit-color-swatch-wrapper {
      padding: 0;
    }
    
    &::-webkit-color-swatch {
      border: none;
      border-radius: 8px;
    }
  }

  .color-values {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
  }

  .rgb-values {
    display: flex;
    gap: 1rem;
    font-family: monospace;
    font-size: 0.9rem;
    color: #666;
  }
}

.bg-upload {
  .bg-preview {
    width: 100%;
    height: 200px;
    border-radius: 8px;
    border: 2px dashed #eee;
    margin-bottom: 1rem;
    overflow: hidden;
    background-color: #f8f9fa;
    position: relative;

    img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
  }

  .bg-actions {
    display: flex;
    gap: 1rem;

    .btn-remove {
      background: #e74c3c;
      color: white;
      border: none;
      border-radius: 6px;
      padding: 0.5rem 1rem;
      cursor: pointer;
      transition: all 0.3s ease;

      &:hover {
        background: #c0392b;
      }
    }
  }
}

select {
  width: 100%;
  padding: 0.8rem;
  border: 2px solid #eee;
  border-radius: 8px;
  font-size: 1rem;
  background-color: white;
  cursor: pointer;
  transition: border-color 0.3s ease;

  &:focus {
    outline: none;
    border-color: #3498db;
  }
}

.theme-mode-switch {
  display: flex;
  gap: 1rem;

  button {
    flex: 1;
    padding: 0.8rem;
    border: 2px solid #eee;
    background: white;
    border-radius: 8px;
    cursor: pointer;
    transition: all 0.3s ease;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 0.5rem;
    color: #2c3e50;

    i {
      font-size: 1.2rem;
    }

    &:hover {
      transform: translateY(-2px);
      box-shadow: 0 4px 8px rgba(0,0,0,0.1);
    }

    &.active {
      background: #3498db;
      color: white;
      border-color: #3498db;
    }
  }
}

// 添加过渡动画
.skill-item, .project-item, .admin-card {
  transition: all 0.3s ease;
}

// 添加悬浮效果
.admin-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 8px 15px rgba(0,0,0,0.1);
}

.dark-mode .admin-card:hover {
  box-shadow: 0 8px 15px rgba(0,0,0,0.3);
}

// 添加动画效果
@keyframes modalFadeIn {
  from {
    opacity: 0;
    transform: translateY(-20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.modal-content {
  animation: modalFadeIn 0.3s ease;
}
</style> 