import React from 'react';
import { Membership, NetworkNode } from '../types';
import { Plus, Trash2, User, Network } from 'lucide-react';

interface NetworkTreeProps {
  memberships: Membership[];
  rootNode: NetworkNode;
  setRootNode: React.Dispatch<React.SetStateAction<NetworkNode>>;
}

interface TreeNodeProps {
  node: NetworkNode;
  memberships: Membership[];
  onUpdate: (id: string, updates: Partial<NetworkNode>) => void;
  onAddChild: (id: string) => void;
  onDelete: (id: string) => void;
}

// Extracted Component to prevent re-rendering/focus issues
const TreeNode: React.FC<TreeNodeProps> = ({ node, memberships, onUpdate, onAddChild, onDelete }) => {
  const membership = memberships.find(m => m.id === node.membershipId) || memberships[0];
  const isRoot = node.id === 'root';

  return (
    <div className="flex flex-col items-center">
      {/* Node Card */}
      <div className={`
        relative flex flex-col items-center p-3 rounded-xl border-2 shadow-sm transition-all w-48 sm:w-56 group bg-white z-10
        ${isRoot ? 'border-blue-500 shadow-blue-100' : 'border-slate-200 hover:border-blue-300'}
      `}>
        {/* Not: Eski üst çizgi (absolute -top-6) kaldırıldı, artık wrapper tarafından yönetiliyor */}

        <div className="w-full space-y-2">
          {/* Header: Icon & ID */}
          <div className="flex items-center justify-between w-full mb-1">
             <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white shadow-sm shrink-0 ${membership.id === 'platin' ? 'bg-slate-600' : membership.id === 'altin' ? 'bg-yellow-500' : membership.id === 'gumus' ? 'bg-gray-400' : 'bg-orange-500'}`}>
                <User size={16} />
             </div>
             <input 
                type="text" 
                placeholder="ID Giriniz"
                value={node.memberId || ''}
                onChange={(e) => onUpdate(node.id, { memberId: e.target.value })}
                className="text-[10px] text-right text-slate-500 border border-slate-100 rounded px-1 py-0.5 w-24 focus:border-blue-400 outline-none bg-slate-50"
             />
          </div>
          
          {/* Name & Membership */}
          <div className="space-y-1">
            <input 
              type="text" 
              value={node.name}
              onChange={(e) => onUpdate(node.id, { name: e.target.value })}
              className="w-full text-center font-bold text-slate-800 text-sm border-b border-transparent hover:border-slate-300 focus:border-blue-500 outline-none bg-transparent px-1"
            />
            
            <select 
              value={node.membershipId}
              onChange={(e) => onUpdate(node.id, { membershipId: e.target.value })}
              className="w-full text-center text-xs p-1 rounded bg-slate-50 border border-slate-200 text-slate-600 outline-none focus:ring-1 focus:ring-blue-500"
            >
              {memberships.map(m => (
                <option key={m.id} value={m.id}>{m.name}</option>
              ))}
            </select>
          </div>

          {/* Stats: PV & BV */}
          <div className="grid grid-cols-2 gap-2 pt-1">
             <div className="bg-emerald-50 rounded border border-emerald-100 p-1 flex flex-col items-center">
                <span className="text-[9px] text-emerald-600 font-bold">PV</span>
                <input 
                  type="number" 
                  value={node.personalPV || 0}
                  onChange={(e) => onUpdate(node.id, { personalPV: parseFloat(e.target.value) || 0 })}
                  className="w-full text-center text-xs font-semibold text-emerald-800 bg-transparent outline-none p-0"
                />
             </div>
             <div className="bg-amber-50 rounded border border-amber-100 p-1 flex flex-col items-center">
                <span className="text-[9px] text-amber-600 font-bold">BV</span>
                <input 
                  type="number" 
                  value={node.personalBV || 0}
                  onChange={(e) => onUpdate(node.id, { personalBV: parseFloat(e.target.value) || 0 })}
                  className="w-full text-center text-xs font-semibold text-amber-800 bg-transparent outline-none p-0"
                />
             </div>
          </div>

          {/* Note Section */}
          <div className="pt-2 w-full">
            <textarea
              placeholder="Not ekle..."
              value={node.note || ''}
              onChange={(e) => onUpdate(node.id, { note: e.target.value })}
              className="w-full text-[10px] text-slate-600 border border-slate-200 rounded p-1.5 focus:border-blue-400 outline-none resize-none bg-slate-50 h-12"
            />
          </div>

        </div>

        {/* Action Buttons */}
        <div className="flex gap-1 mt-3 pt-2 border-t border-slate-100 w-full justify-center">
           <button 
             onClick={() => onAddChild(node.id)}
             disabled={node.children.length >= 5}
             className={`p-1.5 rounded-full transition ${node.children.length >= 5 ? 'text-slate-300 cursor-not-allowed' : 'text-blue-600 hover:bg-blue-50 bg-blue-50/50'}`}
             title="Alt kol ekle"
           >
             <Plus size={16} />
           </button>
           {!isRoot && (
             <button 
               onClick={() => onDelete(node.id)}
               className="p-1.5 text-red-500 hover:bg-red-50 bg-red-50/50 rounded-full transition"
               title="Sil"
             >
               <Trash2 size={16} />
             </button>
           )}
        </div>

        {/* Connector Line Logic (Bottom) - Only if children exist */}
        {node.children.length > 0 && (
           <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 w-px h-6 bg-slate-300"></div>
        )}
      </div>

      {/* Children Container */}
      {node.children.length > 0 && (
        <div className="flex pt-6 justify-center">
          {node.children.map((child, index) => {
            const isFirst = index === 0;
            const isLast = index === node.children.length - 1;
            const isSingle = node.children.length === 1;

            return (
              <div key={child.id} className="relative px-2 sm:px-4 flex flex-col items-center">
                
                {/* Connector Lines Area (Top of the child wrapper) */}
                <div className="absolute top-0 left-0 right-0 h-6">
                   {/* Vertical line connecting down to the child card */}
                   <div className="absolute left-1/2 -translate-x-1/2 top-0 h-full w-px bg-slate-300"></div>
                   
                   {/* Horizontal connecting lines */}
                   {!isSingle && (
                     <>
                        {/* Line to Left (if not first child) */}
                        {!isFirst && (
                          <div className="absolute top-0 left-0 w-1/2 h-px bg-slate-300"></div>
                        )}
                        {/* Line to Right (if not last child) */}
                        {!isLast && (
                          <div className="absolute top-0 right-0 w-1/2 h-px bg-slate-300"></div>
                        )}
                     </>
                   )}
                </div>

                <TreeNode 
                  node={child} 
                  memberships={memberships} 
                  onUpdate={onUpdate}
                  onAddChild={onAddChild}
                  onDelete={onDelete}
                />
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

const NetworkTree: React.FC<NetworkTreeProps> = ({ memberships, rootNode, setRootNode }) => {
  
  const updateNode = (targetId: string, updates: Partial<NetworkNode>) => {
    const updateRecursive = (node: NetworkNode): NetworkNode => {
      if (node.id === targetId) {
        return { ...node, ...updates };
      }
      return {
        ...node,
        children: node.children.map(updateRecursive)
      };
    };
    setRootNode(prev => updateRecursive(prev));
  };

  const addChild = (parentId: string) => {
    const updateRecursive = (node: NetworkNode): NetworkNode => {
      if (node.id === parentId) {
        if (node.children.length >= 5) {
          alert("Maksimum 5 kol ekleyebilirsiniz.");
          return node;
        }
        return {
          ...node,
          children: [
            ...node.children,
            {
              id: crypto.randomUUID(),
              name: 'Yeni Üye',
              membershipId: 'bronz',
              memberId: '',
              personalPV: 0,
              personalBV: 0,
              note: '',
              children: []
            }
          ]
        };
      }
      return {
        ...node,
        children: node.children.map(updateRecursive)
      };
    };
    setRootNode(prev => updateRecursive(prev));
  };

  const deleteNode = (nodeId: string) => {
    if (nodeId === 'root') return; 
    
    const deleteRecursive = (node: NetworkNode): NetworkNode => {
      return {
        ...node,
        children: node.children
          .filter(child => child.id !== nodeId)
          .map(deleteRecursive)
      };
    };
    setRootNode(prev => deleteRecursive(prev));
  };

  const calculateTotalNetwork = (node: NetworkNode): number => {
    let count = 1;
    node.children.forEach(child => {
      count += calculateTotalNetwork(child);
    });
    return count;
  };

  return (
    <div className="bg-slate-50 min-h-[600px] p-4 rounded-xl border border-slate-200 overflow-hidden flex flex-col">
      <div className="flex flex-col md:flex-row justify-between items-center mb-6 bg-white p-4 rounded-lg shadow-sm border border-slate-100 gap-4">
         <div>
            <h3 className="font-bold text-slate-800 flex items-center gap-2">
               <span className="bg-blue-600 text-white p-1 rounded">
                  <Network size={16} />
               </span>
               Üyelik Ağacı
            </h3>
            <p className="text-xs text-slate-500 mt-1">
               Toplam Ağaç Büyüklüğü: <strong className="text-blue-600">{calculateTotalNetwork(rootNode)}</strong> Üye
            </p>
         </div>
      </div>

      <div className="flex-1 overflow-auto cursor-grab active:cursor-grabbing p-4 sm:p-10 flex justify-center bg-white rounded-xl border border-slate-200 shadow-inner bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:16px_16px]">
        <div className="min-w-fit pb-12">
           <TreeNode 
              node={rootNode} 
              memberships={memberships} 
              onUpdate={updateNode} 
              onAddChild={addChild} 
              onDelete={deleteNode} 
            />
        </div>
      </div>
    </div>
  );
};

export default NetworkTree;