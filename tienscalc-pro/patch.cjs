const fs = require('fs');

let content = fs.readFileSync('App.tsx', 'utf8');

content = content.replace(
    "import NetworkTree from './components/NetworkTree';",
    "import NetworkTree from './components/NetworkTree';\nimport Experiences from './components/Experiences';"
);

content = content.replace(
    "TableProperties\n} from 'lucide-react';",
    "TableProperties,\n  MessageSquare\n} from 'lucide-react';"
);

content = content.replace(
    /const \[activeTab, setActiveTab\] = useState<\'products\' | \'compare\' | \'memberships\' | \'tree\'>\(\'products\'\);/,
    "const [activeTab, setActiveTab] = useState<'products' | 'compare' | 'memberships' | 'tree' | 'experiences'>('products');"
);

content = content.replace(
    /<button[\s\S]*?onClick=\{\(\) => setActiveTab\('tree'\)\}[\s\S]*?className=\{`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all \$\{activeTab === 'tree' \? 'bg-blue-600 shadow-lg shadow-blue-900\/50 text-white' : 'text-slate-400 hover:bg-slate-800 hover:text-white'\}`\}[\s\S]*?>[\s\S]*?<Network size=\{20\} \/>[\s\S]*?<span className="font-medium">Ağaç<\/span>[\s\S]*?<\/button>/,
    `$&

          <button 
            onClick={() => setActiveTab('experiences')}
            className={\`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all \${activeTab === 'experiences' ? 'bg-blue-600 shadow-lg shadow-blue-900/50 text-white' : 'text-slate-400 hover:bg-slate-800 hover:text-white'}\`}
          >
            <MessageSquare size={20} />
            <span className="font-medium">Deneyimler</span>
          </button>`
);

content = content.replace(
    /\{activeTab === 'tree' && 'Üyelik Ağacı'\}/,
    "{activeTab === 'tree' && 'Üyelik Ağacı'}\n            {activeTab === 'experiences' && 'Ürün Deneyimleri'}"
);

content = content.replace(
    /<\/div>[\s]*?<\/div>[\s]*?\}\)[\s]*?<\/div>[\s]*?<\/main>/,
    `            </div>
          )}
          
          {activeTab === 'experiences' && (
             <Experiences />
          )}
        </div>
      </main>`
);

content = content.replace(
    /<button[\s\S]*?onClick=\{\(\) => setActiveTab\('tree'\)\}[\s\S]*?className=\{`flex flex-col items-center justify-center p-2 rounded-lg w-16 transition-colors \$\{activeTab === 'tree' \? 'text-blue-600 bg-blue-50' : 'text-slate-400 hover:bg-slate-50'\}`\}[\s\S]*?>[\s\S]*?<Network size=\{20\} \/>[\s\S]*?<span className="text-\[10px\] mt-1 font-medium">Ağaç<\/span>[\s\S]*?<\/button>/,
    `$&
        <button 
          onClick={() => setActiveTab('experiences')}
          className={\`flex flex-col items-center justify-center p-2 rounded-lg w-16 transition-colors \${activeTab === 'experiences' ? 'text-blue-600 bg-blue-50' : 'text-slate-400 hover:bg-slate-50'}\`}
        >
          <MessageSquare size={20} />
          <span className="text-[10px] mt-1 font-medium">Deneyim</span>
        </button>`
);

fs.writeFileSync('App.tsx', content);
console.log('App.tsx patched successfully.');
